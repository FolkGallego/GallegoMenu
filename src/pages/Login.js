import React, { useState } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

function Login(props) {

    const [validate, setValidated] = useState(false);
    const [user, setUser] = useState(null);

    firebase.auth().onAuthStateChanged((u) => {
        if (u) {
            setUser(u)
        } else {
            setUser(null);
        }
    });

    const LoginButtonPressed = (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        firebase.auth().signInWithEmailAndPassword(email.value, password.value).then((userCredentails) => {
            //Caso Login efetuado com sucesso
            var user = userCredentails.user;
            alert("Sucesso no Login")
            setUser(user);
            setValidated(true);
        }).catch((e) => {
            alert(e.message);
            setValidated(true);
        })
    }

    const LogoutButtonPressed = () => {
        firebase.auth().signOut().then(() => {
            //Logout com Sucesso
            alert("Logout efetuado com sucesso")
            setUser(null);
            setValidated(false);
        }).catch((e) => {
            alert(e.message);
        })
    }

    return (
        <>
            {(user === null) && <Card style={{ margin: 24, }}>
                <Card.Header>
                    <Image src={'https://rlv.zcache.com.br/adesivo_redondo_crista_da_familia_de_gallegos_brasao_de_galleg-rc75166f4d7e540c0bf7c56cf1f85884e_0ugmp_8byvr_307.jpg'} style={{ width: 80, marginBottom: 8 }} />
                    <h4>Login do Administrador</h4>
                    <p style={{ marginTop: 8, fontSize: 12, color: '#A1A1A1' }}>É um Administrador, realize o Login para continuar, caso não possuir Login, informe seu Gerente o quanto antes</p>

                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validate} onSubmit={LoginButtonPressed}>

                        <Form.Group className='mb-3' controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder='Entre com o E-mail' size='md' />
                            <Form.Control.Feedback type='invalid'>E-mail é requerido.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className='mb-3' controlId='password'>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder='Entre com a senha' size='md' />
                            <Form.Control.Feedback type='invalid'>Senha é requerida.</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant='primary' type='submit' size='md' style={{ fontWeight: 'bold' }}>
                            Login ❯
                        </Button>
                        {/* <p>{user.email}</p> */}
                    </Form>
                </Card.Body>
                <Card.Footer>

                    <a href="/" style={{ marginTop: 8, fontSize: 12, }}>← Voltar ao Menu</a>
                </Card.Footer>
            </Card>}
            {(user !== null) && <div style={{ margin: 24 }}>
                <p>Login já foi efetuado. Vá para <a href="/dashboard">Dashboard</a></p>
                <p>Para efetuar o Logout <a href="/login" onClick={LogoutButtonPressed}>Logout</a></p>
            
            </div>}

        </>
    );
}

export default Login;