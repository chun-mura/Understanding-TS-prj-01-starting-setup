import axios from 'axios';

declare const process: {
  env: {
    GOOGLE_API_KEY: string;
  };
};

const form = document.querySelector('form')! as HTMLFormElement;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Google Maps APIを動的に読み込む
function loadGoogleMapsAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve();
      return;
    }

    const script = document.getElementById('google-maps-script') as HTMLScriptElement;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
  });
}

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // send this to Google's API
  axios.get<GoogleGeocodingResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`
  ).then(response => {
    if (response.data.status !== 'OK') {
      throw new Error('Could not fetch location!');
    }
    const coordinates = response.data.results[0].geometry.location;
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: coordinates,
      zoom: 16,
    });
    new google.maps.Marker({ position: coordinates, map: map });
  })
    .catch((err: any) => {
      alert(err.message);
      console.log(err);
    });
}

// ページ読み込み時にGoogle Maps APIを読み込む
loadGoogleMapsAPI()
  .then(() => {
    console.log('Google Maps API loaded successfully');
    form.addEventListener('submit', searchAddressHandler);
  })
  .catch((error) => {
    console.error('Failed to load Google Maps API:', error);
    alert('Google Maps APIの読み込みに失敗しました。APIキーを確認してください。');
  });
