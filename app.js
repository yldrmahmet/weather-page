

// api url ve key
const url = "http://api.openweathermap.org/data/2.5/";
const key = "6d3d9e93e56c54bd4bc9a0b2df9a759e";

// sehir ismi yazilan yerin id'si searchBar
const searchBar = document.getElementById('searchBar');

const setQuery = (e) => {
    if (e.key === 'Enter') // eger basilan tus enter ise (enterin key code = 13)
        getResult(searchBar.value); // sehir ismini searchBar.value degiskeni tutacak
}

// searchBar icindeyken bir tusa basildiginda setQuery fonksiyonunu tetikler,
searchBar.addEventListener('keypress', setQuery);

/* getResult fonksiyonu girilen sehiri alip apiden o sehrin bilgilerini cekecek
 ve fetch .then yapisini kullanarak bu bilgiler alinir*/
const getResult = (cityName) => {
    // units metric yapinca derece cinsinden sicaklik gosteriyo
    let query = url + "weather?q=" + cityName + "&appid=" + key + "&units=metric&lang=tr";
    fetch(query) // query degiskeni ile apideki veriler cekilir
        .then(weatherInfo => {
            return weatherInfo.json();
        })
        .then(displayResult)
}

// apiyle alinan bilgileri yazar
const displayResult = (result) => {
    let city = document.querySelector('.city'); // sehir

    //console.log(city);

    if (result.cod === '404') {
        city.innerText = 'Şehir bulunamadı';
    }
    else {
        city.innerText = `${result.name},${result.sys.country}`;
    }

    let temp = document.querySelector('.temp'); // sicaklik
    if (result.cod === '404')
        temp.innerText = " ";
    else
        temp.innerText = `${Math.round(result.main.temp)}°C`;

    let desc = document.querySelector('.desc'); // aciklama
    if (result.cod === '404')
        desc.innerText = " ";
    else
        desc.innerText = result.weather[0].description;

    let maxmin = document.querySelector('.maxmin'); // en az en cok sicaklik
    if (result.cod === '404')
        maxmin.innerText = " ";
    else
        maxmin.innerText = `${Math.round(result.main.temp_min)}°C / ${Math.round(result.main.temp_max)}°C`;

    // 'açık' kelimesi içeriliyorsa arka planı beyaz yap
    if (result.weather[0].description.includes('açık'))
        document.body.style.background = 'url(acik.jpeg)';

    else if (result.weather[0].description.includes('az bulutlu'))
        document.body.style.background = 'url(azbulutlu.jpg)';

    else if (result.weather[0].description.includes('parçalı bulutlu'))
        document.body.style.background = 'url(parcalibulutlu.jpg)';

    else
        document.body.style.background = 'url(thumb.jpg)';

    //arkaplan ayarlari
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
}

const mapButton = document.getElementById('button');

// butona tıklayinca tetiklenir
mapButton.addEventListener('click', () => {
    // arama kutusuna girilen sehir ismini al
    const cityName = searchBar.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric&lang=tr`)
        .then(response => response.json())
        .then(data => {
            // Şehrin koordinatlarını alın
            const cityCoordinates = [data.coord.lat, data.coord.lon];
            const temperature = `${Math.round(data.main.temp)}°C`;
            const description = data.weather[0].description;
            const minMaxTemperature = `${Math.round(data.main.temp_min)}°C / ${Math.round(data.main.temp_max)}°C`;

            // harita
            const mapUrl = `map.html?city=${cityName}&lat=${cityCoordinates[0]}&lon=${cityCoordinates[1]}&temp=${temperature}&desc=${description}&maxmin=${minMaxTemperature}`;
            window.open(mapUrl, '_blank');
        })
});
