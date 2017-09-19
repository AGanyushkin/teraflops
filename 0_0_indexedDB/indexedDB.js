
const initData = [
	{ ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
	{ ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
]

// INIT

const dbName = "the_name"
let request = indexedDB.open(dbName, 2)
request.onerror = (event) => {
	console.log('error')
	console.log(event)
}
request.onupgradeneeded = (event) => {
	const db = event.target.result
	const objectStore = db.createObjectStore("tasks", { keyPath: "ssn" })
	objectStore.createIndex("name", "name", { unique: false })
	objectStore.createIndex("email", "email", { unique: true })

	for (var i in initData) {
		objectStore.add(initData[i])
	}
}



// ADD
request = indexedDB.open(dbName, 2)
request.onerror = (event) => {
	console.log(event)
}
request.onsuccess = (event) => {
	db = event.target.result

  	let transaction = db.transaction(["tasks"], "readwrite")
	transaction.oncomplete = (event) => {
		alert("All done!")
	}

	transaction.onerror = (event) => {
		console.log(event)
	}

	transaction
		.objectStore("tasks")	
		.add(
			{ ssn: "444-44-4477", name: "Bill", age: 35, email: "billwe@company.com" }
		)
}
