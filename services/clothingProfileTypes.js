class clothingProfileTypes {
  constructor(data) {
    this.user_id = data.user_id;
    this.shoes = {
      shoes: { bool: data.hasShoes },
      boots: { bool: data.hasWarmShoes },
      sandals: { bool: data.OpenShoes }
    };
    this.pants = {
      pants: { bool: data.hasLongPants },
      shorts: { bool: data.hasShortPants },
    };
    this.shirts = {
      tshirt: { bool: data.hasTShirt },
      longsleeve: { bool: data.hasLongShirt },
      hoodie: { bool: data.hasHoodie },
    };
    this.jackets = {
      rainjacket: { bool: data.hasRainJacket },
      winterjacket: { bool: data.hasWinterJacket },
      lightjacket: { bool: data.hasLightJacket }
    };
    this.extras = {
      cap: { bool: data.hasCap },
      beanie: { bool: data.hasBeanie },
      gloves: { bool: data.hasGloves },
      scarf: { bool: data.hasScarf },
      umbrella: { bool: data.hasUmbrella },
      sunglasses: { bool: data.hasSunglasses }
    }
  }
}
