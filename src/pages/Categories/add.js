import React, { useState } from 'react';
import { Form, Modal, Button, Alert, Container } from 'react-bootstrap';
import api from "../../services/api";
import './styles.css';
import ButtonEdit from './../../assets/images/edit.png';


export const EditCategory = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src={ButtonEdit} className="button-edit" onClick={handleShow} alt="Edit Invoice" />
            <ModalCategory show={show} loader={props.loader} categoryId={props.categoryId} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export const ModalCategory = (props) => {

    const [values, setValues] = useState({ name: '' });
    const [msgSuccess, setSuccess] = useState('');

    const loadItem = async () => {
        const category = await api.get('/categories/' + props.categoryId);
        setValues(category.data);
    }


    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }

    const removeItem = async (id) =>{

        try {
            if (window.confirm("Você realmente deseja remover essa categoria?")) {
                await api.delete('/categories/' + id);

                setSuccess('Removido com sucesso.');
                setTimeout(e => {
                    props.handleClose();
                    setValues({ name: '' });
                    setSuccess(false);
                }, 1500);

                props.loader('reset');
            }
        } catch (error) {
            console.log(error);
        }

  
    }

    const saveItem = async () => {

        const { name } = values;

        if (props.categoryId) {
            await api.put('/categories/' + props.categoryId, {
                name
            });
        } else {
            await api.post('/categories', {
                name
            });
        }


    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await saveItem();
            setSuccess('Salvo com sucesso.');
            setTimeout(e => {
                props.handleClose();
                setValues({ name: '' });
                setSuccess(false);
            }, 1500);
            props.loader('reset');

        } catch (error) {
            console.log(error);
        }

    }

    if (props.show && props.categoryId && !values.name) {
        loadItem();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Categoria {props.categoryId} </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        <Alert show={msgSuccess} variant="success">{msgSuccess}</Alert>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="description">
                                <Form.Label>Nome: </Form.Label>
                                <Form.Control type="text" name="name" placeholder="Nome da categoria" onChange={handleInputChange} value={values.name} required />
                            </Form.Group>


                            <Modal.Footer>
                                {props.categoryId &&
                                    <Button variant="danger" onClick={() => removeItem(props.categoryId)}> Excluir </Button>
                                }
                                <Button variant="dark" type="submit"> Salvar </Button>
                            </Modal.Footer>

                        </Form>
                    </Container>
                </Modal.Body>

            </Modal>
        </>
    );
}

export const AddCategory = (props) => {


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                Novo
            </Button>

            <ModalCategory show={show} loader={props.loader} handleClose={handleClose} handleShow={handleShow} />

        </>
    );
}

export default AddCategory;