const getYouTubeVideoId = (url) => {
  let videoId = '';
  if (!url) return videoId; // handle null or undefined URLs
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0] || '';
  } else if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('shorts/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  return videoId;
};

export const productVideoData = {
  'credit-card': [
    {
      id: 'cc1',
      title: "Earn ₹50,000/Month Selling Credit Cards",
      description: "Online | GroMo App #shorts",
      url: "https://www.youtube.com/shorts/rXywVTcNrvo",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/rXywVTcNrvo')}/mqdefault.jpg`
    },
    {
      id: 'cc2',
      title: "Earn by Selling Credit Cards Through GroMo",
      description: "",
      url: "https://www.youtube.com/shorts/3cRS0XbLSHM",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/3cRS0XbLSHM')}/mqdefault.jpg`
    },
    {
      id: 'cc3',
      title: "How to Transfer Money from Credit Card to Bank Account",
      description: "",
      url: "https://www.youtube.com/shorts/T8RH9XCKj8w",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/T8RH9XCKj8w')}/mqdefault.jpg`
    },
    {
      id: 'cc4',
      title: "Earn up to ₹3000 in 3 Easy Steps",
      description: "GroMo",
      url: "https://www.youtube.com/shorts/ql-5QK6FJuk",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/ql-5QK6FJuk')}/mqdefault.jpg`
    },
    {
      id: 'cc5',
      title: "Har ek payment credit card se - why?",
      description: "#gromo #creditcard",
      url: "https://www.youtube.com/watch?v=ejn2Z5P4GnU",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/watch?v=ejn2Z5P4GnU')}/mqdefault.jpg`
    },
    {
      id: 'cc6',
      title: "Refer and Earn Rs 2250 on Axis Bank Credit Card",
      description: "",
      url: "https://www.youtube.com/watch?v=9W9Fjndc08I",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/watch?v=9W9Fjndc08I')}/mqdefault.jpg`
    },
    {
      id: 'cc7',
      title: "Apply for IDFC First Bank Credit Card",
      description: "Complete process",
      url: "https://www.youtube.com/watch?v=Na8RTwiSz-c",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/watch?v=Na8RTwiSz-c')}/mqdefault.jpg`
    },
    {
      id: 'cc8',
      title: "Credit Card Hacks",
      description: "GroMo #shorts #creditcard",
      url: "https://www.youtube.com/shorts/24TqpSz-Tmc",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/24TqpSz-Tmc')}/mqdefault.jpg`
    },
    {
      id: 'cc9',
      title: "Can a credit card help you with your new year resolutions?",
      description: "#gromo",
      url: "https://www.youtube.com/shorts/F5EQuX2Zh-w",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/F5EQuX2Zh-w')}/mqdefault.jpg`
    },
    {
      id: 'cc10',
      title: "How to get a credit card for a low credit score?",
      description: "",
      url: "https://youtube.com/shorts/ytDpvve7iVI",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://youtube.com/shorts/ytDpvve7iVI')}/mqdefault.jpg`
    }
  ],
  'personal-loan': [
    {
      id: 'pl1',
      title: "Instant Personal Loan in Just 10 Minutes!",
      description: "No Bank Visit, No Hassle!",
      url: "https://www.youtube.com/shorts/bGNoDe8P9kU",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/bGNoDe8P9kU')}/mqdefault.jpg`
    },
    {
      id: 'pl2',
      title: "Want a Loan? Do THIS First! (5 Must-Know Tips)",
      description: "",
      url: "https://www.youtube.com/shorts/yBawt3EEWfs",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/yBawt3EEWfs')}/mqdefault.jpg`
    },
    {
      id: 'pl3',
      title: "Are Instant Personal Loan Apps Safe?",
      description: "",
      url: "https://www.youtube.com/shorts/dgsT8cFTcd0",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/dgsT8cFTcd0')}/mqdefault.jpg`
    },
    {
      id: 'pl4',
      title: "5 Best Banks for Personal Loan?",
      description: "",
      url: "https://www.youtube.com/watch?v=snDhthLJKIo",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/watch?v=snDhthLJKIo')}/mqdefault.jpg`
    },
    {
      id: 'pl5',
      title: "How to Get a Bank Loan Without Salary Slip in 2025",
      description: "",
      url: "https://www.youtube.com/shorts/2Lbx0Gsg90g",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/2Lbx0Gsg90g')}/mqdefault.jpg`
    },
    {
      id: 'pl6',
      title: "Cheapest Personal Loan in India",
      description: "",
      url: "https://www.youtube.com/shorts/kWsZmo7B6z0",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/kWsZmo7B6z0')}/mqdefault.jpg`
    },
    {
      id: 'pl7',
      title: "How to Take a Loan Wisely",
      description: "",
      url: "https://www.youtube.com/shorts/GZ25okN16sc",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/GZ25okN16sc')}/mqdefault.jpg`
    }
  ],
  'savings': [
    {
      id: 'sa1',
      title: "Sell Savings Account & Earn Money",
      description: "#shorts #savingsaccount #tips",
      url: "https://www.youtube.com/shorts/fmL7J9FTyo4",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/fmL7J9FTyo4')}/mqdefault.jpg`
    },
    {
      id: 'sa2',
      title: "Best Banks For Savings Accounts in India",
      description: "GroMo",
      url: "https://www.youtube.com/shorts/OtMP62FE_lU",
      thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId('https://www.youtube.com/shorts/OtMP62FE_lU')}/mqdefault.jpg`
    }
  ],
  'investment': [
    { id: 'inv1', title: 'Investment Video 1', description: '', url: "http://www.youtube.com/watch?v=uEHFT1F2Iyw", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=uEHFT1F2Iyw")}/mqdefault.jpg` },
    { id: 'inv2', title: 'Investment Video 2', description: '', url: "http://www.youtube.com/watch?v=67Z1l36SLI8", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=67Z1l36SLI8")}/mqdefault.jpg` },
    { id: 'inv3', title: 'Investment Video 3', description: '', url: "http://www.youtube.com/watch?v=6XN0LlRe4VM", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=6XN0LlRe4VM")}/mqdefault.jpg` },
    { id: 'inv4', title: 'Investment Video 4', description: '', url: "http://www.youtube.com/watch?v=l4HQtympLi4", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=l4HQtympLi4")}/mqdefault.jpg` },
    { id: 'inv5', title: 'Investment Video 5', description: '', url: "http://www.youtube.com/watch?v=mMQUl38T03c", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=mMQUl38T03c")}/mqdefault.jpg` },
  ],
  'business-loan': [
    { id: 'bl1', title: 'Business Loan Video 1', description: '', url: "http://www.youtube.com/watch?v=uAhmc1z6MEI", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=uAhmc1z6MEI")}/mqdefault.jpg` },
    { id: 'bl2', title: 'Business Loan Video 2', description: '', url: "http://www.youtube.com/watch?v=d5IMiNC0qIU", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=d5IMiNC0qIU")}/mqdefault.jpg` },
    { id: 'bl3', title: 'Business Loan Video 3', description: '', url: "http://www.youtube.com/watch?v=6XN0LlRe4VM", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=6XN0LlRe4VM")}/mqdefault.jpg` },
    { id: 'bl4', title: 'Business Loan Video 4', description: '', url: "http://www.youtube.com/watch?v=0NwxXHcaZyc", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=0NwxXHcaZyc")}/mqdefault.jpg` },
    { id: 'bl5', title: 'Business Loan Video 5', description: '', url: "http://www.youtube.com/watch?v=9FpYkx3iWwA", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("http://www.youtube.com/watch?v=9FpYkx3iWwA")}/mqdefault.jpg` },
  ],
  'demat': [
    { id: 'dm1', title: 'Demat Account Video 1', description: '', url: "https://www.youtube.com/watch?v=c58HHvIMOXo", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=c58HHvIMOXo")}/mqdefault.jpg` },
    { id: 'dm2', title: 'Demat Account Video 2', description: '', url: "https://www.youtube.com/watch?v=xdFM15rhgPg", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=xdFM15rhgPg")}/mqdefault.jpg` },
    { id: 'dm3', title: 'Demat Account Video 3', description: '', url: "https://www.youtube.com/watch?v=jrRmuv3ppwE", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=jrRmuv3ppwE")}/mqdefault.jpg` },
    { id: 'dm4', title: 'Demat Account Video 4', description: '', url: "https://www.youtube.com/watch?v=vDa-_CIZ9Bg", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=vDa-_CIZ9Bg")}/mqdefault.jpg` },
    { id: 'dm5', title: 'Demat Account Video 5', description: '', url: "https://www.youtube.com/watch?v=gh56kpfLDY0", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=gh56kpfLDY0")}/mqdefault.jpg` },
    { id: 'dm6', title: 'Demat Account Video 6', description: '', url: "https://www.youtube.com/watch?v=k2MaGShuFh4", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=k2MaGShuFh4")}/mqdefault.jpg` },
    { id: 'dm7', title: 'Demat Account Video 7', description: '', url: "https://www.youtube.com/watch?v=-kU8Kr6mck0", thumbnail: `https://i.ytimg.com/vi/${getYouTubeVideoId("https://www.youtube.com/watch?v=-kU8Kr6mck0")}/mqdefault.jpg` },
  ]
}; 