<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:param name="Lang" select="'en'"/>
<xsl:template match="*">
  <xsl:if test="not(@lang) or @lang = $Lang">
      <xsl:copy> <xsl:apply-templates/> </xsl:copy>
  </xsl:if>
</xsl:template>
</xsl:stylesheet>
