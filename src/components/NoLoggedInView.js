import React from 'react';
import { Col, Image, Row, Container } from 'react-bootstrap';
import notLoggedInImage from '../assets/Login.png'
function NoLoggedInView(props) {
return (
<>
<Container>
<Row className="align-items-center">
<Col>
<Image src={`${notLoggedInImage}`} style={{ width: '80%' }} />
</Col>
<Col>
<h1>Login é requerido</h1>
<p>Você não é logado. Vá para <a href="/login">login</a> é realize o primeiro acesso.</p>
</Col>
</Row>
</Container>
</>
);
}
export default NoLoggedInView;