package Songbee;
use Cwd;
use Maypole::Application qw(-Debug);
#Songbee->config->{cache_options} = {
#           class => "Cache::FileCache",
#};
Songbee->config->{display_tables} = ["song", "playlist", "play_item"];
Songbee->config->{uri_base} = "http://localhost:8080/";
Songbee->config->{template_root} = "./templates";
#Songbee->setup("dbi:mysql:workship");
Songbee->setup("dbi:SQLite:workship.db");
use Maypole::Constants; 
sub debug { 1}

sub parse_path { my $self = shift; 
$self->{path} ||= "/playlist/list";
$self->SUPER::parse_path(); }

sub is_applicable {
    my $self = shift;
    return DECLINED if ($self->{path} =~ /static/);
    return $self->SUPER::is_applicable();
}

package Songbee::Playlist;
use base qw(Maypole::Model::CDBI Class::DBI::SQLite);
Songbee::Playlist->untaint_columns(
    printable => [qw/name/]
);
Songbee::Playlist->has_many(play_items => "Songbee::PlayItem", {
order_by => "position" });
Songbee::Playlist->has_many(songs => ["Songbee::PlayItem" => "song"], { order_by => 'position' });
sub compose :Exported {}
sub edit :Exported {
    my ($self, $r) = @_;
    $r->{template_args}{songs} = [ Songbee::Song->retrieve_all ];
}
sub do_remove :Exported {
    my ($class, $r, $self) = @_;
    my $item = Songbee::PlayItem->retrieve($r->{args}[0]);
    if ($item) {
        my $pos = $item->position;
        $item->delete;
        for (grep {$_->position > $pos} $self->play_items) {
            $_->position($_->position-1);
        }
    }
    $r->{template} = "edit";
    $class->edit($r);
}

sub do_add :Exported {
    my ($self, $r, $playlist) = @_;
    Songbee::PlayItem->create({
        playlist => $playlist->id,
        song => $r->{params}{options},
        position => 1+@{[ $playlist->songs ]},
    });
    $r->{template} = "edit";
    $r->{template_args}{songs} = [ Songbee::Song->retrieve_all ];
}

sub do_reorder :Exported {
    my ($self, $r, $playlist) = @_;
    $r->{template} = "edit";
    $r->{template_args}{songs} = [ Songbee::Song->retrieve_all ];
}

package Songbee::PlayItem;
use base qw(Maypole::Model::CDBI Class::DBI::SQLite);
Songbee::PlayItem->has_a(song => "Songbee::Song");
Songbee::PlayItem->has_a(playlist => "Songbee::Playlist");
sub console :Exported {}
sub nav :Exported {}
sub view_current :Exported { my ($self, $r) = @_; $r->template("view") }
sub view_next :Exported { my ($self, $r) = @_; $r->template("view") }

sub next_item {
    my $self = shift;
    my @later = 
            grep {$_->position > $self->position }
            $self->playlist->play_items;
    return $later[0];
}

sub prev_item {
    my $self = shift;
    my @earlier = 
            grep {$_->position < $self->position }
            reverse $self->playlist->play_items;
    return $earlier[0];
}

package Songbee::Song;
use base qw(Maypole::Model::CDBI Class::DBI::SQLite);
use HTML::Entities;
sub stringify_column { "title" }
sub display_columns { ("title", "first_line", "song_key") }
sub column_names { (shift->SUPER::column_names,song_key => "Key", ) }
Songbee::Song->has_a("song_key" => "Songbee::SongKey");
Songbee::Song->columns(TEMP => qw/ _parsed_xml /);
use Encode qw(_utf8_on);
Songbee::Song->add_trigger( select => sub { 
    my $song = shift; 
    _utf8_on($song->{title}); 
    _utf8_on($song->{first_line});
});
use strict;
sub projector :Exported {}
sub view_nojs :Exported {}
sub add :Exported {}
sub do_add :Exported {}

sub view_xml :Exported {
    my ($self, $r, $song) = @_;
    $r->content_type("text/xml");
    $r->output($song->xml);
    return;
} 

sub name {
    my $song = shift;
    if (@_) { return $song->title(@_) }
    my $t = $song->title;
    my $f = $song->first_line;
    $t =~ s/^\s*//; $t =~ s/\s*$//; $t =~ s/\W+/ /g;
    $f =~ s/^\s*//; $f =~ s/\s*$//; $f =~ s/\W+/ /g;
    if (uc $t ne uc $f) { return $song->title." (".$song->first_line.")"; }
    return $song->title;
}

sub _fill_xml {
    my $self = shift;
    my $x;
    return $x if $x = $self->_parsed_xml;
    my ($head)= $self->xml =~ /<head>(.*?)<\/head>/gsm;
    my $x = {};
    ($x->{lyrics})= $self->xml =~ /<lyrics>(.*?)<\/lyrics>/gsm;
    for (qw(author owner year)) {
        ($x->{$_}) = $head =~ /<$_>(.*?)<\/$_>/gsm;
    }
    $self->_parsed_xml($x);
    $x;
}

sub author { $_[0]->_fill_xml->{author}; }
sub owner { $_[0]->_fill_xml->{owner}; }
sub year { $_[0]->_fill_xml->{year}; }
sub to_text {
    my $lyrics = shift->_fill_xml->{lyrics};
    $lyrics =~ s/(&#10;|\n)/\n/g;
    decode_entities($lyrics);
    my $output;
    for (split /\n/, $lyrics) {
        s/<\/?verse>//g;
        s/\s*<\/?line>\s*//g;
        s/<\/(bridge|chorus)>/\n/;
        if ( s/<(bridge|chorus)>//) { $output .= "\n\u$1:"; }
        s/<sup text="(.*?)">(.*?)<\/sup>/($2|$1)/gsm;
        $output .= $_."\n";
    }
    $output =~ s/\n\s*\n/\n\n/gsm;
    $output =~ s/^\n\s*//;
    chomp $output;
    return $output;
}
sub from_text {
    my ($self, $params) = @_;
    my $output = "<song>\n<head>\n<title>$params->{title}</title>\n";
    $output .= "<copyright>\n\t<author>$params->{author}</author>\n";
    $output .= "\t<owner>$params->{owner}</owner>\n</copyright>\n";
    $output .= "<key>$params->{key}</key>\n</head>\n\n";
    $output .= "<lyrics>";
    $params->{lyrics} =~ s/\r//g;
    my @parts = split /\n\n/,$params->{lyrics};
    for my $part (@parts) {
        my @lines = split /\n/, $part;
        my $type = "verse";
        if ($lines[0] =~ /^(chorus|bridge)/i) {
            shift @lines;
            $type = lc $1;
        }
        $output .= "<$type>\n";
        for (@lines) {
            s/\((.*?)\|(.*?)\)/<sup text="$2">$1<\/sup>/g;
            $output .= "    <line>$_</line>\n";
        }
        $output .= "</$type>\n";
    }
    $output .= "</lyrics>\n</song>\n";
    $output;
}

sub get_first_line {
    my $self = shift;
    my $lyrics = $self->_fill_xml->{lyrics};
    my @parts = $lyrics->content_list;
    my ($part) = grep ref, $lyrics->content_list;
    my ($line) = grep ref, $part->content_list;
    $self->first_line($line->as_trimmed_text);
}

sub do_edit :Exported {
    my ($self, $r, $song) = @_;
    my $h = CGI::Untaint->new(%{$r->{params}});
    my $params = {
        map {$_ => $h->extract(-as_printable => $_) }
        qw(title author owner key),
        lyrics => $r->{params}{lyrics}
    };
    my $xml = $self->from_text($params);
    if (!$song) { 
        $song = $self->create({
        title => $params->{title},
        })
    } else {
        $song->title($params->{title});
    }
    $song->song_key(Songbee::SongKey->find_or_create(name => $params->{key}));
    $song->xml($xml);
    $song->get_first_line();
    $r->{template} = "list";
    $self->list($r);
}

1;
