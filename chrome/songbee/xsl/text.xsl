<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:output method="text"/>
<xsl:strip-space elements="chorus bridge sup line verse"/>
<xsl:template match="song"><xsl:apply-templates /></xsl:template>
<xsl:template match="title"/>
<xsl:template match="key" />
<xsl:template match="copyright"/>
<xsl:template match="lyrics"><xsl:apply-templates/></xsl:template>
<xsl:template match="text()"><xsl:value-of select="normalize-space(.)"/></xsl:template>
<xsl:template match="head"/>
<xsl:template match="verse"><xsl:for-each select="line"><xsl:apply-templates/><xsl:text>
</xsl:text></xsl:for-each><xsl:text>
</xsl:text></xsl:template>

<xsl:template match="chorus">Chorus:
<xsl:for-each select="line"><xsl:apply-templates/><xsl:text>
</xsl:text></xsl:for-each><xsl:text>
</xsl:text></xsl:template>

<xsl:template match="bridge">Bridge:
<xsl:for-each select="line"><xsl:apply-templates/><xsl:text>
</xsl:text></xsl:for-each><xsl:text>
</xsl:text></xsl:template>

<xsl:template match="sup">(<xsl:apply-templates/>|<xsl:value-of select="@text"/>)</xsl:template>
</xsl:stylesheet>
