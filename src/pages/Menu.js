import React, { useEffect, useState } from 'react';
import { Table, Card, Image, Button, Spinner } from 'react-bootstrap';

import FirestoreService from '../utils/services/FirestoreService';

function Menu(props) {

    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        FirestoreService.getAllMenuItems().then((response) => {
            setIsLoading(false);
            setMenuItems(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Ocorreu um erro ao carregar o Menu. " + e);
        })
    }, [])

    return (
        <>
            {(isLoading === true) && <Spinner animation="border" variant="secondary" />}
            <Card style={{ margin: 24 }}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div className="align-items-center" style={{ marginRight: 8 }}>
                        <Image src={'https://rlv.zcache.com.br/adesivo_redondo_crista_da_familia_de_gallegos_brasao_de_galleg-rc75166f4d7e540c0bf7c56cf1f85884e_0ugmp_8byvr_307.jpg'} style={{ width: 150 }} />
                        <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>A mais de 60 anos promovendo experiencias Luxuriosas</p>
                    </div>
                   
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price (MYR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(menuItems) && (menuItems.map((menuItem, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{menuItem.doc.data.value.mapValue.fields.itemNome.stringValue}</td>
                                    <td>{menuItem.doc.data.value.mapValue.fields.itemCategoria.stringValue}</td>
                                    <td>{menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue ? menuItem.doc.data.value.mapValue.fields.itemPreco.doubleValue : menuItem.doc.data.value.mapValue.fields.itemPreco.integerValue}</td>
                                </tr>
                            )))}
                        </tbody>
                    </Table>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                    <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>© 2022 Gallego</p>
                    <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}><a href="/login">Login do Administrador</a> </p>
                </Card.Footer>
            </Card>
        </>
    );
}

export default Menu;