<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!-- just pretty printing, not necessary -->
<xsl:output method="xml"  indent="yes"/>
<xsl:output method="html" indent="yes"/>
<!-- strip leading whitespace -->
<xsl:strip-space elements="*"/>

<xsl:template match="song">
        <xsl:apply-templates />
</xsl:template>

  <xsl:template match="title">
  </xsl:template>
<xsl:template match="head"/>

  <xsl:template match="key" />
  <xsl:template match="copyright">
    <!-- <div class="copyright"> <xsl:apply-templates/> </div> -->
  </xsl:template>
  <xsl:template match="lyrics">
    <xsl:apply-templates/>
  </xsl:template>

<xsl:template match="verse">
  <div class="verse">
  <span class="partnum"> <xsl:value-of select="count(preceding-sibling::verse)+1"/></span>
  <div class="container">
  <xsl:for-each select="line">
  <p class="line">
    <xsl:apply-templates/>
  </p>
  </xsl:for-each>
  </div>
  </div>
</xsl:template>

<xsl:template match="chorus">
  <div class="chorusdiv">
  <span class="partnum"> C </span>
  <div class="container">
  <xsl:for-each select="line">
  <p class="line">
    <xsl:apply-templates/>
  </p>
  </xsl:for-each>
  </div>
  </div>
</xsl:template>

<xsl:template match="bridge">
  <div class="bridge">
  <span class="partnum"> B </span>
  <div class="container">
  <xsl:for-each select="line">
  <p class="line">
    <xsl:apply-templates/>
  </p>
  </xsl:for-each>
  </div>
  </div>
</xsl:template>

<xsl:template match="sup"> 
<nobr><ruby style="position:relative">
<rb><xsl:apply-templates/></rb>
<rt class="sup">
<xsl:value-of select="@text"/>
</rt>
</ruby></nobr>
</xsl:template>

</xsl:stylesheet>
