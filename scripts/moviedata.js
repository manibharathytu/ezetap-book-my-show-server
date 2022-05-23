var genre = ['SciFi', 'Romance', 'Action', 'Comedy', 'Thriller', 'Adventure', 'Action/Comedy', 'RomCom', 'SciFi', 'Action']
var actor = ['Brad Pitt', 'Rajnikanth', 'Shahrukh Khan', 'Aamir Khan', 'Ranbir Kapoor', 'Tom Cruise', 'Hrithik Roshan', 'Kamal Hasan', 'Ryan Gosling', 'Neil Patrick Harris']
var actress = ['Angelina Jolie', 'Aishwarya Rai', 'Anushka Sharma', 'Salma Hayek', 'Katrina Kaif', 'Emma Watson', 'Pooja hegde', 'Simran', 'Jyothika', 'Nagma', 'Kristen Stewart', 'Alexandria Daddario']
var movieName = ['Lord of the rings', 'Harry Potter', 'Superman', 'Spiderman', 'Dil Se', 'Beast', 'KGF', 'Vikram', 'Batman', 'Avengers', 'Ironman', 'Petta']
// var movieName = ['Lord of the rings', 'Harry Potter', 'Superman', 'Spiderman', 'Dil Se', 'Beast', 'KGF', 'Vikram', 'Batman', 'Avengers', 'Ironman', 'Petta']
// var movieName = ['Lord of the rings', 'Harry Potter', 'Superman', 'Spiderman', 'Dil Se', 'Beast', 'KGF', 'Vikram', 'Batman', 'Avengers', 'Ironman', 'Petta']
var language = ['English', 'Tamil', 'Hindi']


var theatresList = ['Pvr', 'Escape', 'Jupiter', 'GV studio', 'Imax', 'Urvasi', 'Blumaan', 'Saraswathi', 'Luxe', 'Phoenix']
var timings = ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',]
var location = ['Chennai', 'Mumbai', 'Bangalore', 'Delhi', 'Pune']
var price = [120, 200, 230, 250, 350, 400]


function rand(max) {
    return Math.floor(Math.random() * max)
}
function getRandomOne(arr) {
    return arr[rand(arr.length)]
}

function buildMovie() {
    let movie = {}

    movie.name = getRandomOne(movieName) + ' Part ' + rand(10)
    movie.genre = getRandomOne(genre)
    movie.lang = getRandomOne(language)
    movie.cast = getRandomOne(actor) + ', ' + getRandomOne(actress)
    movie.theatres = buildTheatres(rand(4)+1) // +1 is to avoid 0, need to use better way with min n max rand gen 

    return movie

}

function buildMovies(n = 2) {
    movies = []
    for (let i = 0; i < n; i++) {
        movie = buildMovie()
        movies.push(movie)
    }
    return movies

}

function getTimings() {
    n = rand(4)+1
    timingsArr = []
    for (let i = 0; i < n; i++) {
        timingsArr.push(getRandomOne(timings))
    }
    return timingsArr.toString().replace(/,/g, ", ");
}
function buildTheatre() {
    let theatre = {}

    theatre.name = getRandomOne(theatresList) //+ ' Screen ' + rand(10)
    theatre.location = getRandomOne(location)
    theatre.price = getRandomOne(price)
    theatre.timing = getTimings()

    return theatre
}

function buildTheatres(n = 2) {
    theatres = []
    for (let i = 0; i < n; i++) {
        theatre = buildTheatre()
        theatres.push(theatre)
    }
    return theatres

}

function deleteAll(){
    var dbName = "mydb"

    collName = 'movies'
    var dbo = conn.db(dbName);
    dbo.collection(collName).deleteMany({}, function (err, result) {
        if (err)  console.log(err)
        else {
            console.log(result)
        }
    })
}

// console.log(buildMovies(3))
// console.log(buildTheatres(3))

insert(buildMovies(1))







function p(x) {
    console.log(x)
}


function insert(jsonData) {
    var dbName = "mydb"

    collName = 'movies'
    var dbo = conn.db(dbName);

    // if (operation == 'insert') {
        dbo.collection(collName).insert(jsonData, function (err, result) {
            if (err) console.log(err)
            else {
                // res.send({ 'result': 'suc' })
                console.log(result)
            }
        })
    // }
}