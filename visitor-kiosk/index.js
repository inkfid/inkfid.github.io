const hostMessage = `### 📢 You have a visitor 📢

Hello, **$hostFirstName**!

Your guest **$name** has just arrived in reception.

Please come and greet them when you are ready. 😊

🛜 _If your guest needs WIFI, you can [create a login and password for them here](https://sponsor.travelport.com/).
Guest WIFI name: TPGUEST_
`;

const parcelMessage = `### 📦 You have a delivery 📦

Hello.  A parcel has been left for you in reception.  
Please come and collect it at your earliest convenience. 
`;

const deliveryMessage = "A delivery has arrived at reception. - This message is set in index.js";

//Load cards
//import { sendCardMessage } from './cards/sendCardMessage.js';
//import { loadCardTemplate } from './cards/loadCardTemplate.js';

//Adding helper function to use adaptive cards - Sep-01-2025
async function loadCardTemplate(path, replacements) {
  const response = await fetch(path);
  const card = await response.json();

  const cardString = JSON.stringify(card);
  const replaced = Object.entries(replacements).reduce((str, [key, value]) =>
    str.replaceAll(`$${key}`, value), cardString);

  return JSON.parse(replaced);
}
// End of new section

const dataModel = {
  deliveryNotice: false,
  deliveryNoticeMessage: '',
// home > checkIn > findHost > confirmHost > photo > confim > registered | checkOut > checkOutResult
  page: 'home',
  name: '',
  email: '',
  hostSearch: '',
  currentHost: null,
  date: 'October 6, 2022',
  time: '10:35 AM',
  foundHosts: [],
  searchStatus: '',
  photo: null,
  photoTimer: 0,
  photoTime: 0,
  videoStream: null,
  phoneNumber: '',
  taxiNumber: '',
  selectedRecipient: null,
  countdown: 3,
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37964.479957946394!2d-121.95893677399364!3d37.41713987799405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fc911562d481f%3A0xd3d896b473be003!2sCisco%20Systems%20Building%2012!5e0!3m2!1sen!2sno!4v1674211511880!5m2!1sen!2sno',

  init() {
    this.updateTimeAndDate();
    setInterval(() => this.updateTimeAndDate(), 30 * 1000);
    const params = new URLSearchParams(location.search);
    this.mapUrl = params.get('map') || this.mapUrl;
    this.theme = params.get('theme');

    if (this.theme) {
      // <link href="styles/theme-night.css" rel="stylesheet">
      const head = document.getElementsByTagName("head")[0];
      head.insertAdjacentHTML(
        "beforeend",
        `<link rel="stylesheet" href="styles/theme-cisco.css" />`);
    }
    // quick jump to photo page for dev:
    // this.showPhotoPage();
    // this.name = 'Tore Bjolseth';
    // this.email = 'tbjolset@cisco.com';
    // this.currentHost = { displayName: 'Anna Gjerlaug' };
  },

  home() {
    this.page = 'home';
    this.reset();
  },

  // function added to format name to capitalised First letters
  formatName(name) {
    return name
    .split(' ')
    .map(part => part.charAt (0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
  },
  
  reset() {
    this.name = '';
    this.email = '';
    this.currentHost = null;
    this.selectedRecipient = null;
    this.foundHosts = [];
    this.searchStatus = '';
    this.photo = null;
    this.phoneNumber = '';
    clearInterval(this.photoTimer);
  },
  
  call() {
    const defaultNumber = '25521830437@travelport-beta.webex.com';
    const number = new URLSearchParams(location.search).get('reception') || defaultNumber;
    location.href = `tel:${number}`;
  },

// Code for Send Delivery Message - to a group space  
sendDeliveryMessage() {
  const token = this.getToken();
  const roomId = "Y2lzY29zcGFyazovL3VzL1JPT00vODBlY2Q5YjAtNTk5MC0xMWVhLWFlZGQtOGQxMWJmYzkxNGNm";
  const markdown = "A delivery has arrived at reception. - This message is markdown in index.js";
  const message = "A delivery has arrived at reception. - this message is message in index.js";

sendDeliveryMessage(token, roomId, markdown, message)
    .then(() => {
      this.deliveryNoticeMessage = "The team have been notified.";
      this.deliveryNotice = true;
      setTimeout(() => { this.deliveryNotice = false; }, 7000);
    })
    .catch(() => {
      this.deliveryNoticeMessage = "Failed to notify the team.";
      this.deliveryNotice = true;
      setTimeout(() => { this.deliveryNotice = false; }, 7000);
    });
},

// A new method to send delivery notifications to individuals instead of a space seen above

deliveryNotify() {
  this.page = 'deliveryNotify';
  this.hostSearch = '';
  this.foundHosts = [];
  this.searchStatus = '';
},

searchRecipient() {
  const word = this.hostSearch.trim();
  const token = this.getToken();
  if (word.length > 2) {
    this.searchStatus = 'Searching...';
    searchPerson(word, token, list => {
      this.foundHosts = list;
      this.searchStatus = 'Found: ' + list.length;
    });
  } else {
    this.foundHosts = [];
    this.searchStatus = '';
  }
},

confirmRecipient() {
  this.page = 'confirmRecipient';
},
  
sendDeliveryToRecipient(recipient) {
  this.selectedRecipient = recipient; // Store for confirmation
  setTimeout(() => {
    this.page = 'confirmRecipient';
  },0);
//  this.confirmRecipient(); // Navigate to confirmation page
},

// Original delivery code - replace is card code breaks
//notifyRecipient() {  
//  const token = this.getToken();
//  const email = this.selectedRecipient.emails[0];
//  const msg = "📦 A parcel has arrived for you at reception. 📦";
//  sendMessage(token, email, parcelMessage)
//    .then(() => {
//      this.deliveryNoticeMessage = "Recipient notified.";
//      this.deliveryNotice = true;
//      this.page = 'deliveryConfirmed'; // Show confirmation page
//      // This seems to remove the name from confirmation page | this.reset(); //Clear fields
//      // Delay clearing selectedRecipient (in seconds) until after confirmation is shown
//      setTimeout(() => {
//        this.reset(); //This will clear selectedRecipient
//      },7000);
//    })
//    .catch(() => {
//      this.deliveryNoticeMessage = "Failed to notify recipient.";
//      this.deliveryNotice = true;
//      setTimeout(() => { this.deliveryNotice = false; }, 7000);
//    });
//},

// New delivery card - Sep-01-2025
async notifyRecipient() {
  const token = this.getToken();
  const email = this.selectedRecipient.emails[0];

  const card = await loadCardTemplate('/cards/deliveryCard_branded.json', {
    recipientName: this.selectedRecipient.displayName,
    time: this.time
  });

  sendCardMessage(token, email, card)
    .then(() => {
      this.deliveryNoticeMessage = "Recipient notified.";
      this.deliveryNotice = true;
      this.page = 'deliveryConfirmed';
      setTimeout(() => this.reset(), 7000);
    })
    .catch(() => {
      this.deliveryNoticeMessage = "Failed to notify recipient.";
      this.deliveryNotice = true;
      setTimeout(() => { this.deliveryNotice = false; }, 7000);
    });
},
// End of new section
  
 get validForm() {
   const emailPattern = /\w+@\w+/;
   if (this.page === 'checkIn') {
     return this.name.trim().length >= 2; // This requires a valid email --> && this.email.match(emailPattern);
   }
   else if (this.page === 'checkOut') {
     return this.email.match(emailPattern);
   }
   else if (this.page === 'taxi') {
     return this.phoneNumber.length > 3;
   }
   return true;
 },
// Replaced this the next section
//  get validform(){
//    if (this.page === 'checkIn' {
//      return this.name.time().length; // Only require name
//    }
//  }
  checkIn() {
    this.page = 'checkIn';
    this.focus('#name');
  },

  focus(id) {
    // need to wait for DOM to be updated
    setTimeout(() => {
      const firstInput = document.querySelector(id);
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);

  },

  findHost() {
    this.page = 'findHost';
    this.focus('#host');
  },

  // Original Register - send message model - replace if card code breaks
 // register() {
 //   this.page = 'registered';
 //   if (!this.currentHost) {
 //     return;
 //   }
 //   const firstName = this.currentHost.displayName.split(" ")[0];
 //   const msg = hostMessage
 //     .replace('$name', this.name.trim())
 //     .replace('$email', this.email.trim())
 //     .replace('$hostFirstName', firstName);
    
 //   const email = this.currentHost.emails[0];
 //   const token = this.getToken();
 //   if (!token) {
 //     return;
 //   }

// New code to send vistior info as an adaptive card - Sep-01-2025
async register() {
  this.page = 'registered';
  if (!this.currentHost) return;

  const token = this.getToken();
  const email = this.currentHost.emails[0];
  const firstName = this.currentHost.displayName.split(" ")[0];
  const photoUrl = this.photo ? this.photoSrc() : "https://via.placeholder.com/150";

  const card = await loadCardTemplate('/cards/visitorCard_branded.json', {
    name: this.name.trim(),
    hostFirstName: firstName,
    time: this.time,
    photoUrl: photoUrl
  });

  sendCardMessage(token, email, card)
    .catch(e => {
      console.warn(e);
      alert('We were not able to send a card to the host at this time.');
    });

  this.photo = null;
},
// End of new section
  
//    sendMessage(token, email, msg, this.photo)
//      .catch(e => {
//        console.warn(e);
//        alert('We were not able to send a message to the host at this time.');
//      });
//    // Clear the photo from memory
//    this.photo = null;
//   },

  selectHost(host) {
    this.currentHost = host;
    this.hostSearch = '';
    this.searchStatus = '';
    this.foundHosts = [];
    this.next();
  },

  getToken() {
    // TODO perhaps use localStorage intead?
    return new URLSearchParams(location.search).get('token');
  },

  next() {
    // home > checkIn > findHost > photo > confim > registered
    const { page } = this;

    if (page === 'home') {
      this.checkIn();
    }
    else if (page === 'checkIn') {
      this.name = this.formatName(this.name); //added this line to format entered name
      this.findHost();
    }
    else if (page === 'findHost') {
      this.confirmHost();
    }
    else if (page === 'confirmHost') {
      this.showPhotoPage();
    }
   // Use this if you want to bypass photos
   // else if (page === 'confirmHost') {
   //   this.showConfirmation();
   // }
    else if (page === 'photo') {
      this.showConfirmation();
    }
    else if (page === 'confirm') {
      this.register();
    }
    else if (page === 'checkOut') {
      this.page = 'checkOutResult';
    }
    else if (page === 'taxi') {
      this.taxiNumber = Math.ceil(Math.random() * 10000);
      this.page = 'taxiConfirmed';
    }

    else {
      console.error('unknown next page');
    }
  },

  back() {
    // home > checkIn > findHost > photo > confim > registered | checkOut
    const { page } = this;
    if (page === 'checkIn') {
      this.home();
    }
    else if (page === 'findHost') {
      this.checkIn();
    }
    else if (page === 'confirmHost') {
      this.findHost();
    }
    else if (page === 'photo') {
      this.confirmHost();
    }
    else if (page === 'confirm') {
      this.showPhotoPage();
    }
    else {
      console.error('unknown previous page');
    }

  },

  showConfirmation() {
    this.stopCamera();
    this.page = 'confirm';
  },

  checkout() {
    this.page = 'checkOutResult';
  },

  async showPhotoPage() {
    this.page = 'photo';
    try {
      if (navigator.mediaDevices.getUserMedia) {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.querySelector('.webcam');
        video.srcObject = this.videoStream;
      }
    }
    catch(e) {
      console.error('not able to get video', e);
    }
  },

  stopCamera() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => {
        track.stop();
      });
    }
  },

  takePhotoCountdown() {
    this.photo = null;
    document.querySelector('.photo-flash').classList.remove('blink');
    clearInterval(this.photoTimer);
    this.photoTime = 3;
    this.photoTimer = setInterval(() => {
      this.photoTime -= 1;
      if (this.photoTime < 1) {
        clearInterval(this.photoTimer);
        this.takePhoto();
      }
    }, 1000);
  },

  takePhoto() {
    // user has navigated away, skip
    if (this.page !== 'photo') {
      return;
    }

    document.querySelector('#shutter-sound').play();
    document.querySelector('.photo-flash').classList.add('blink');

    const w = 600;
    const h = 337;
    const canvas = document.querySelector('.photo');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    const video = document.querySelector('.webcam');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 600, 337);
    // this.photo = canvas.toDataURL('image/jpeg');

    const format = 'jpeg';
    this.photo = canvas.toBlob(photo => {
      this.photo = new File([photo], this.name + '.' + format, { type: "image/" + format, });
    }, 'image/' + format);

    // to compress for jpeg for webex cards, look at:
    // https://github.com/jpeg-js/jpeg-js/blob/master/lib/encoder.js
  },

  searchHost() {
    const word = this.hostSearch.trim();

    const token = this.getToken();

    if (word.length > 2) {
      this.searchStatus = 'Searching...';
      searchPerson(word, token, list => {
        this.foundHosts = list;
        this.searchStatus= 'Found: ' + list.length;
      });
    }
    else {
      this.foundHosts = [];
      this.searchStatus = '';
    }
  },

  confirmHost() {
    this.page = 'confirmHost';
  },

  getAvatar(person) {
    const { avatar } = person || {};
    return avatar
      ? { backgroundImage: `url(${avatar.replace('~1600', '~110')})` }
      : null;
  },

  checkOut() {
    this.page = 'checkOut';
  },

  updateTimeAndDate() {
    const now = new Date();
    this.date = now.format('mmmm d, yyyy');
    this.time = now.format('HH:MM');
  },

  // create img data url from blob
  photoSrc() {
    if (!this.photo) return;
    const url = window.URL.createObjectURL(this.photo);
    console.log('created', url);
    return url;
  }

};


