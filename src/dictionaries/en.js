const dict = {
  meta: {
    title: "Moikato — jewellery from Brazil, worn around the world",
    description:
      "Handmade Brazilian jewellery of golden grass and memory. Designed in Brazil, worn around the world — for those who took Brazil with them.",
  },
  header: {
    brand: "moikato",
    home: "Moikato — home",
    nav: {
      collection: "Collection",
      story: "Our story",
      journal: "Events",
      worldwide: "Worldwide",
      resellers: "Resellers",
    },
    mainNav: "Main navigation",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuNav: "Navigation",
  },
  hero: {
    title: "Made in Brazil. Chosen by you.",
    sub: "Handcrafted jewellery with history, identity and presence.",
    cta: "Explore the collection",
  },
  manifesto: {
    eyebrow: "Material & memory",
    line: "Some people sell jewellery. We prefer to keep memories.",
    film: "The Moikato film",
    filmStatus: "In production",
    craftAlt: "Hands working with natural fibres using artisanal techniques",
    tableAlt: "Table setting with Brazilian objects and natural materials",
  },
  worn: {
    eyebrow: "Designed in Brazil.",
    title: "Worn around the world.",
    caption: "Brazilian pieces finding new bodies, styles and stories.",
    backstageAlt: "Model wearing a golden Moikato necklace and bracelet backstage at a fashion show",
    backstageCaption: "Moikato in motion · backstage",
    editorialAlt: "Model wearing handcrafted golden necklaces and a woven-fibre bag in a fashion editorial",
    editorialCaption: "Brazilian materials · new perspectives",
    cta: "Shop the collection",
  },
  collection: {
    eyebrow: "Collection",
    viewAll: "View all pieces",
    order: "Order",
    pieces: [
      { name: "Golden Grass Earrings", price: "£180" },
      { name: "Our Lady Rosary", price: "£220" },
      { name: "Moonstone Ring", price: "£150" },
    ],
    waPiece: 'Hello! I\'m interested in "{name}" ({price}). Is it still available?',
  },
  story: {
    eyebrow: "Our story",
    imageAlt: "Samuel Moikato presenting a pair of handcrafted earrings among his pieces",
    quote:
      "Samuel Moikato makes every piece by hand using golden grass and other Brazilian materials. The work begins at his table and has reached fairs and runways across the UK. That is Moikato's story so far.",
  },
  events: {
    eyebrow: "Fairs & gatherings",
    title: "Meet Moikato near you.",
    intro:
      "Meet us to see the pieces up close, discover their materials and talk about the Brazil each one carries.",
    nextLabel: "Next event",
    when: "When",
    where: "Where",
    routeCta: "Get directions",
    previousTitle: "Where we have been",
    demoNote: "Demonstration schedule",
    events: [
      {
        day: "12–13",
        month: "September",
        monthShort: "Sep",
        year: "2026",
        name: "London Brazilian Design Fair",
        place: "The Truman Brewery · London",
        schedule: "Saturday and Sunday · 10am–6pm",
        address: "91 Brick Lane, London E1 6QR",
        mapUrl: "https://maps.google.com/?q=The+Truman+Brewery+London",
        image: "/tecendo.jpg",
        alt: "Demonstration of handcrafting with natural fibres",
      },
      {
        day: "18",
        month: "May",
        monthShort: "May",
        year: "2026",
        name: "Brazilian Makers Market",
        place: "Bristol · England",
        image: "/event-samuel-fair.png",
        imagePosition: "center 18%",
        alt: "Samuel Moikato presenting his golden-grass pieces at a fair",
      },
      {
        day: "2026",
        month: "",
        monthShort: "",
        year: "2026",
        name: "International Recognition",
        place: "Moikato recognition · London",
        image: "/event-award.jpeg",
        imagePosition: "center 42%",
        alt: "Samuel Moikato receiving an international recognition on stage",
      },
      {
        day: "2026",
        month: "",
        monthShort: "",
        year: "2026",
        name: "Royal Castles Congress Day",
        place: "London · England",
        image: "/event-congress.png",
        imagePosition: "center 35%",
        alt: "Samuel Moikato at the Royal Castles Congress Day in London",
      },
    ],
  },
  world: {
    eyebrow: "Found around the world",
    viewAll: "See all",
    cities: [
      { city: "London", country: "England" },
      { city: "Dublin", country: "Ireland" },
      { city: "Lisbon", country: "Portugal" },
      { city: "Paris", country: "France" },
      { city: "Toronto", country: "Canada" },
      { city: "Sydney", country: "Australia" },
    ],
  },
  resellers: {
    eyebrow: "Stockists",
    title: "Bring Moikato into your shop.",
    intro:
      "If you select independent design for a shop or cultural space, speak directly with Samuel about working together.",
    details:
      "Tell us where you are and what sort of pieces you are looking for. We can then discuss the selection, quantity and lead time.",
    cta: "Enquire about stocking Moikato",
    message:
      "Hello, Samuel! I am interested in stocking Moikato pieces. May I tell you a little about my shop?",
    imageAlt: "Samuel Moikato standing behind a display of jewellery and handcrafted pieces",
    imageCaption: "A selection made with Samuel · direct contact",
  },
  eventInvitation: {
    eyebrow: "Samuel Moikato · invitations",
    title: "Bring the knowledge of the Cerrado to your audience.",
    intro:
      "Fairs, gatherings and conversations where audiences can discover Moikato's materials, pieces and stories up close.",
    imageAlt: "Samuel Moikato smiling while wearing a handcrafted natural-fibre hat",
    portraitAlt: "Samuel working on a Moikato piece",
    imageCaption: "Samuel Moikato · craft, identity and gatherings",
    availabilityLabel: "Open to invitations",
    availability: "Fairs, gatherings and conversations across the UK and beyond.",
    formats: ["Fairs and exhibitions", "Live demonstrations", "Talks and conversations"],
    responseNote: "Tell us about your event on WhatsApp. We will reply with availability and the best format.",
    options: [
      {
        title: "Bring Moikato to my event",
        cta: "Check availability",
        message:
          "Hello, Samuel! I would like to invite Moikato to take part in a craft event. Could we talk?",
      },
      {
        title: "Invite Samuel to speak",
        cta: "Enquire about a talk",
        message:
          "Hello, Samuel! I would like to invite you to give a talk about craft and Brazilian culture. Could we talk?",
      },
    ],
  },
  footer: {
    tagline: "Jewellery from Brazil, worn around the world.",
    waMessage: "Hello! I came from Moikato's website and would like to see the pieces.",
    cols: [
      {
        title: "Collection",
        links: ["Earrings", "Necklaces", "Rosaries", "Home"],
      },
      {
        title: "Information",
        links: ["About us", "Materials", "Shipping & delivery", "Returns", "FAQ"],
      },
      {
        title: "Support",
        links: ["Contact", "Piece care", "Size guide"],
      },
      { title: "Follow", links: ["Instagram", "WhatsApp"] },
    ],
    copyright: "© {year} Moikato. All rights reserved.",
  },
};

export default dict;
