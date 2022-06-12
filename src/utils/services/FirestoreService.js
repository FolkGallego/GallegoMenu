import { db } from '../firestore'

//Lista todos os Items
function getAllMenuItems() {
    return new Promise((resolve, reject) => {
        db.collection("MenuItems").get().then((allMenuItems) => {
            resolve(allMenuItems);
        }).catch((e) => {
            reject(e);
        })
    })
}
//Lista todas as Categorias
function getAllMenuCategories() {
    return new Promise((resolve, reject) => {
        db.collection("MenuCategories").get().then((allMenuCategories) => {
            resolve(allMenuCategories);
        }).catch((e) => {
            reject(e);
        })
    })
}
//Função que adiciona um item ao Manu
function AddNewMenuItem(itemNome, itemCategoria, itemPreco) {
    return new Promise((resolve, reject) => {
        const data = {
            "itemNome": itemNome,
            "itemCategoria": itemCategoria,
            "itemPreco": parseFloat(itemPreco)
        }

        db.collection("MenuItems").add(data).then((docRef) => {
            resolve(docRef);
        }).catch((e) => {
            reject(e);
        })

    })
}
//Função que Edita o Item do Menu
function UpateMenuItem(menuItemID, itemNome, itemCategoria, itemPreco) {

    return new Promise((resolve, reject) => {

        const data = {
            "itemNome": itemNome,
            "itemCategoria": itemCategoria,
            "itemPreco": parseFloat(itemPreco)
        }

        db.collection("MenuItems").doc(menuItemID).update(data).then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}
//Função que deleta o Item do Menu
function DeleteMenuItem(menuItemID) {
    return new Promise((resolve, reject) => {
        db.collection("MenuItems").doc(menuItemID).delete().then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

export default { getAllMenuItems, getAllMenuCategories, AddNewMenuItem, UpateMenuItem, DeleteMenuItem }