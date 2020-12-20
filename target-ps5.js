let fetch = require('node-fetch');
let player = require('play-sound')(opts = {})
let open = require('open');

// set zipcode!
let zipcode = 94306;

let url = "https://api.target.com/fulfillment_aggregator/v1/fiats/";
let queryParams = `?key=ff457966e64d5e877fdbad070f276d18ecec4a01&nearby=${zipcode}&limit=20&requested_quantity=1&radius=50&include_only_available_stores=true&fulfillment_test_mode=grocery_opu_team_member_test`;
let urlDigital = `${url}81114596${queryParams}`;
let urlPhysical = `${url}81114595${queryParams}`;
let minute = 60000;

let productMap = {
    '81114596': 'https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596',
    '81114595': 'https://www.target.com/p/playstation-5-console/-/A-81114595'
}

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
                if (product.locations.length) {
                    soundRepeat('./Alarm01.wav', 15, 3000);
                    open(productMap[product.product_id]);

                    console.log(`${date} ${name} CONSOLE IN STOCK ----------------------!!!!!!`);
                } else {
                    console.log(`${date} No Stock Available for ${name}`);
                }
            })
        })
        .catch(err => {
            if (retry > 0) {
                console.log(`${date} Failed to retrieve stock for ${name}, retrying ${retry} ${err}`);
                setTimeout(function() {
                    loadPs5(name, url, --retry);
                }, minute / 2);
            } else {
                console.log(`${date} Failed to retrieve stock for ${name} ${err}.  No retries left`);
            }
        })
}

function ping() {
    loadPs5("PS5 Digital Edition", urlDigital);
    loadPs5("PS5 Physical Edition", urlPhysical);

    setTimeout(function () {
        ping()
    }, minute * 1);
}

ping();
