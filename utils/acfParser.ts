/**
 * Transformeert ACF data naar een gefilterde array van actieve blokken.
 * De parser is nu 'fuzzy': hij zoekt naar alles wat op een blok-slot lijkt.
 */
export const formatAcfBlocks = (acfData: any) => {
  if (!acfData || typeof acfData !== 'object') {
    console.warn("SDG-Parser: Geen geldig object ontvangen.");
    return [];
  }

  console.log("SDG-Parser: Start verwerking van keys:", Object.keys(acfData));

  const activeBlocks = [];

  // We itereren over alle keys in het object om 'fuzzy' te matchen
  // Dit vangt zowel block1, block_1, block2, block_2 etc.
  Object.keys(acfData).forEach((key) => {
    if (key.toLowerCase().startsWith('block')) {
      const block = acfData[key];
      if (!block || typeof block !== 'object') return;

      // Probeer het bloktype te vinden (zowel camelCase als underscores)
      const rawType = block.block_type || block.blockType;
      let type = 'none';

      if (typeof rawType === 'object' && rawType !== null) {
        type = rawType.value || 'none';
      } else if (typeof rawType === 'string') {
        type = rawType;
      }

      if (type && type !== 'none' && type !== 'null') {
        const title = block.hero_title || block.heroTitle || '';
        const content = block.cta_text || block.ctaText || block.content_text || block.contentText || '';
        
        let imageUrl = null;
        const rawImage = block.hero_image || block.heroImage;
        if (rawImage) {
          if (typeof rawImage === 'string') {
            imageUrl = rawImage;
          } else if (typeof rawImage === 'object') {
            imageUrl = rawImage.sourceUrl || rawImage.url || null;
          }
        }

        activeBlocks.push({
          id: `acf-${key}-${type}`, 
          type: type,
          data: {
            title: title,
            image: imageUrl,
            content: content,
          }
        });
        console.log(`SDG-Parser: Slot '${key}' herkend als type '${type}'`);
      }
    }
  });

  // Sorteer de blokken op basis van de numerieke waarde in de key (block1 voor block2)
  return activeBlocks.sort((a, b) => {
    const numA = parseInt(a.id.match(/\d+/)?.at(0) || '0');
    const numB = parseInt(b.id.match(/\d+/)?.at(0) || '0');
    return numA - numB;
  });
};