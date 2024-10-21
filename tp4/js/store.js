var contactStore = (function () {
    // Variable privée
    let contactListString = localStorage.getItem("contactList");
    var contactList = contactListString ? JSON.parse(contactListString) : [];

    // Expose these functions via an interface while hiding
    // the implementation of the module within the function() block
    return {
        add: function (_name, _firstname, _date, _address, _mail) {
            var contact = {
                name: _name,
                firstname: _firstname,
                date: _date,
                address: _address,
                mail: _mail,
            };
            // Ajout du contact à la liste
            contactList.push(contact);

            // Persistance de la liste dans une base de données locale du navigateur web
            localStorage.setItem("contactList", JSON.stringify(contactList));

            return contactList;
        },
        reset: function () {
            localStorage.removeItem("contactList");
            contactList = [];
            return contactList;
        },
        getList: function () {
            return contactList;
        },
    };
})();