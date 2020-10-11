// new Promise ((resolve, reject) => {
// 	fetch(`https://swapi.co/api/films/`)
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	// resolve(data1)
// }).then((data) => {
// 	console.log(data);
// })

fetch(`https://swapi.co/api/films/`)
.then(res => res.json())
.then(data => console.log('data:', data))
