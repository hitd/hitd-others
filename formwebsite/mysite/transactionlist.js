a = function(document) {
	var user = document.location.hash.split('=')[1];
	console.log('user is', user);

	var req = new XMLHttpRequest();


	document.querySelector('.transactionUser').innerHTML += " " + user;

	req.open('GET', './transactions/' + user, true);
	req.onreadystatechange = function(aEvt) {
		if (req.readyState == 4) {
			if (req.status == 200) {
				console.log(req.responseText);

				var transactions = JSON.parse(req.responseText);
				var ul = document.querySelector('ul.transactionList');
				var ulParent = ul.parentNode;
				ulParent.removeChild(ul);


				document.querySelector('.transactionsNumber').innerHTML = transactions.length;
				transactions.forEach(function(transaction) {
					var toReturn = document.createElement("li");
					toReturn.innerHTML = transaction.date +" : "+ transaction.amount + " €";
					ul.appendChild(toReturn)
				});
				ulParent.appendChild(ul);

			} else {
				document.querySelector('.transactionsNumber').innerHTML = "0";
				console.log("Erreur pendant le chargement de la page.\n", req);
			}
		}
	};
	req.send(null);


};
a(document);