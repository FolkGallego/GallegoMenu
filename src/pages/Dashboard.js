import React, { useState, useEffect } from 'react';
import { Table, Card, Image, Button, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import FirestoreService from '../utils/services/FirestoreService';
import NotLoggedInView from '../components/NoLoggedInView';


function Dashboard(props) {

    const [user, setUser] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentMenuItem, setCurrentMenuItem] = useState({
        "itemNome": '',
        "itemCategoria": '',
        "itemPreco": 0
    });
    const [currentMenuItemId, setCurrentMenuItemId] = useState("");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    })

    function fetchMenuCategories() {
        setIsLoading(true);
        FirestoreService.getAllMenuCategories().then((response) => {
            setIsLoading(false);
            setMenuCategories(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the menu categories. " + e);
        })
    }

    function fetchMenuItems() {
        setIsLoading(true);
        FirestoreService.getAllMenuItems().then((response) => {
            setIsLoading(false);
            setMenuItems(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the menu item. " + e);
        })
    }

    useEffect(() => {
        if (user !== null) {
            if (menuCategories.length <= 0) {
                fetchMenuCategories();
            }
            fetchMenuItems();
        }
    }, [user])

    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [addEditFormType, setAddEditFormType] = useState('Add'); //Add, Edit
    const [validated, setValidated] = useState(false);

    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

    const handleModalClose = () => {
        setShowAddEditForm(false);
        setShowDeleteDialogue(false);
        setCurrentMenuItemId("");
        setAddEditFormType("Add");
        setCurrentMenuItem({ "itemNome": '', "itemCategoria": '', "itemPreco": 0 })
        setIsLoading(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { itemNome, itemCategoria, itemPreco } = e.target.elements;

        if (itemPreco.value && itemNome.value) {
            if (addEditFormType === "Add") {
                setIsLoading(true);
                FirestoreService.AddNewMenuItem(itemNome.value, itemCategoria.value, itemPreco.value).then(() => {
                    alert(`${itemNome.value} is successfully added to the menu.`)
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            } else if (addEditFormType === "Edit") {
                setIsLoading(true);
                FirestoreService.UpateMenuItem(currentMenuItemId, itemNome.value, itemCategoria.value, itemPreco.value).then(() => {
                    alert(`${itemNome.value} is successfully updated.`);
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            }
        }
        setValidated(true)
    }

    const handleMenuItemDelete = () => {
        setIsLoading(true);
        FirestoreService.DeleteMenuItem(currentMenuItemId).then(() => {
            alert(`Deletion Successful`);
            handleModalClose();
            window.location.reload(false);
        }).catch((e) => {
            alert("Error occured: " + e.message);
            setIsLoading(false);
        })
    }

    return (
        <>
            {/* <h1>Você não está Logado. Realize o Login em <a href="/login">login</a> para acessar a Página de Administradores.</h1> */}
            {(user === null) && <NotLoggedInView />}
            {(isLoading === true) && <Spinner animation="border" variant="secondary" />}
            {(user !== null) && <>

                <Modal show={showAddEditForm} onHide={handleModalClose}>
                    <Form noValidate validated={validated} onSubmit={handleAddEditFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{(addEditFormType === 'Add') ? 'Adicionar Item' : 'Edit'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="itemNome" label="Item Nome" className="mb-3" >
                                <Form.Control required type='text' placeholder='Nome do Item' size='md' value={currentMenuItem?.itemNome} onChange={(e) => {
                                    setCurrentMenuItem({
                                        "itemNome": (e.target.value) ? e.target.value : '',
                                        "itemCategoria": currentMenuItem?.itemCategoria,
                                        "itemPreco": currentMenuItem?.itemPreco
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Nome do Item é requerido</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="itemCategoria" label="Item Category" className="mb-3" >
                                <Form.Select value={currentMenuItem?.itemCategoria} onChange={(e) => {
                                    setCurrentMenuItem({
                                        "itemNome": currentMenuItem?.itemNome,
                                        "itemCategoria": e.target.value,
                                        "itemPreco": currentMenuItem?.itemPreco
                                    })
                                }}>
                                    {(menuCategories) && (menuCategories.map((menuCategory, index) => (
                                  
                                        <option key={index} value={menuCategory.doc.data.value.mapValue.fields.catNome.stringValue}>
                                            {menuCategory.doc.data.value.mapValue.fields.catNome.stringValue}</option>
                                    )))}
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel controlId="itemPreco" label="Price (MYR)" className="mb-3">
                                <Form.Control required type='text' placeholder='Enter item price' size='md' value={currentMenuItem?.itemPreco} onChange={(e) => {
                                    setCurrentMenuItem({
                                        "itemNome": currentMenuItem?.itemNome,
                                        "itemCategoria": currentMenuItem?.itemCategoria,
                                        "itemPreco": e.target.value
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Item Price is required</Form.Control.Feedback>
                            </FloatingLabel>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit">{(addEditFormType === 'Add') ? 'Add' : 'Update'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
             

                {/* Caso confirme a opção de delete START */}
                <Modal show={showDeleteDialogue} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete {currentMenuItem.itemNome}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Você está prestes a deletar {currentMenuItem.itemNome}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
                        <Button variant="danger" onClick={handleMenuItemDelete}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete confirmado na modal END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                            <Image src={'https://rlv.zcache.com.br/adesivo_redondo_crista_da_familia_de_gallegos_brasao_de_galleg-rc75166f4d7e540c0bf7c56cf1f85884e_0ugmp_8byvr_307.jpg'} style={{ width: 80 }} />
                            <h4 style={{ marginTop: 8, }}>Dashboard</h4>
                        </div>
                        <Button style={{ backgroundColor: '#000', borderWidth: 0, }} onClick={() => {
                            setShowAddEditForm(true);
                        }}>Novo Item</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item Nome</th>
                                    <th>Categoria</th>
                                    <th>Preço (BRL)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(menuItems) && (menuItems.map((menuItem, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{menuItem.doc.data.value.mapValue.fields.itemNome.stringValue}</td>
                                        <td>{menuItem.doc.data.value.mapValue.fields.itemCategoria.stringValue}</td>
                                        <td>{menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue ? menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue : menuItem.doc.data.value.mapValue.fields.itemPreco.integerValue}</td>
                                        <td>
                                            <Button variant='primary' onClick={() => {
                                                setCurrentMenuItemId(menuItem.doc.key.path.segments[menuItem.doc.key.path.segments.length - 1])
                                                setCurrentMenuItem({
                                                    "itemNome": menuItem.doc.data.value.mapValue.fields.itemNome.stringValue,
                                                    "itemCategoria": menuItem.doc.data.value.mapValue.fields.itemCategoria.stringValue,
                                                    "itemPreco": menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue ? menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue : menuItem.doc.data.value.mapValue.fields.itemPreco.integerValue
                                                });
                                                setAddEditFormType("Edit");
                                                setShowAddEditForm(true);
                                            }}>✎ Edit</Button>{' '}
                                            <Button variant='danger' onClick={() => {
                                                setCurrentMenuItemId(menuItem.doc.key.path.segments[menuItem.doc.key.path.segments.length - 1]);
                                                setCurrentMenuItem({
                                                    "itemNome": menuItem.doc.data.value.mapValue.fields.itemNome.stringValue,
                                                    "itemCategoria": menuItem.doc.data.value.mapValue.fields.itemCategoria.stringValue,
                                                    "itemPreco": menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue ? menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue : menuItem.doc.data.value.mapValue.fields.itemPreco.integerValue
                                                });
                                                setShowDeleteDialogue(true);
                                            }}>x Delete</Button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between align-items-center">
                        <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>Gallego Menu v1.0.0 - <a href="/login">Logout</a></p>
                    </Card.Footer>
                </Card>
            </>}
        </>
    );
}

export default Dashboard;