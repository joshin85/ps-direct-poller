let fetch = require('node-fetch');
let player = require('play-sound')(opts = {})
let open = require('open');

// digital
let url = "https://api.direct.playstation.com/commercewebservices/ps-direct-us/users/anonymous/products/productList?fields=BASIC&productCodes="
let urlDigital = `${url}3005817`
let urlPhysical = `${url}3005816`
let minute = 60000


function soundRepeat(soundFile, count, delay) {
    sound(soundFile);
    setTimeout(function () {
        if (count > 0) soundRepeat(soundFile, --count, delay);
    }, delay)
}

function sound(soundFile) {
    var player = require('play-sound')(opts = {})
    player.play(soundFile)
}

function loadPs5(name, url, retry = 1) {
    let date = new Date().getHours() + ":" + new Date().getMinutes();
    fetch(url)
        .then(res => res.json())
        .then(results => {
            sound('./Windows Balloon.wav');
            results.products.forEach(product => {
                if (product.stock.stockLevelStatus != "outOfStock") {
                    soundRepeat('./Alarm01.wav', 15, 3000);
                    open('https://direct.playstation.com/en-us/ps5');

                    console.log(`${date} ${name} CONSOLE IN STOCK ${product.stock.stockLevelStatus} ----------------------!!!!!!`)
                } else {
                    console.log(`${date} No Stock Available for ${name}: ${product.stock.stockLevelStatus}`)
                }
            })
        })
        .catch(err => {
            if (retry > 0) {
                console.log(`${date} Failed to retrieve stock for ${name}, retrying ${retry}`)
                setTimeout(function() {
                    loadPs5(name, url, --retry);
                }, minute / 2);
            } else {
                console.log(`${date} Failed to retrieve stock for ${name}.  No retries left`)
            }
        })
}

function ping() {
    loadPs5("PS5 Digital Edition", urlDigital);
    loadPs5("PS5 Physical Edition", urlPhysical);

    setTimeout(function () {
        ping()
    }, (minute * 3) / 2)
}

ping();
