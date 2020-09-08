import React, {useState} from 'react'
import { Navbar,  Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import './styles.css';
import "react-datepicker/dist/react-datepicker.css";
const moment = require("moment");


export default function Filters(props) {

    var dt = new Date(),
    month = dt.getMonth(),
    year = dt.getFullYear();

    const [date_inicial, setDateInicial] = useState(new Date(year, month, 1));
    const [date_final, setDateFinal] = useState(new Date());
    const [values, setValues] = useState({ type: '', status: '' });


    const handleInputChange = (e, p, c) => {

        try {
            const { name, value } = e.target ? e.target : c.target;
            setValues({ ...values, [name]: value });
        } catch (error) {
            console.log(error);
        }
    }


    const submitFilter = async () => {

        let string_filters='';

        if (date_inicial){
            string_filters += '&date_inicial=' + moment(date_inicial).format("YYYY-MM-DD");
        }
        
        if (date_final){
            string_filters += '&date_final=' + moment(date_final).format("YYYY-MM-DD");
        }

        for (const [key, value] of Object.entries(values)) {
            string_filters += '&'+key+'=' + value;
        }

        props.loadInvoices(1, string_filters);
        
    }

    return (

        <div>
      


        <Navbar bg="light" variant="light">
               
        <Form inline>

            <Row>
                <Col xs={2}>
                     <Form.Group controlId="date_initial">
                           <Form.Label>Data Inicial: </Form.Label>
                           <DatePicker  className="input_bootstrap" id="date_initial" name="date_initial" dateFormat="dd/MM/yyyy"  selected={date_inicial} onChange={date => setDateInicial(date)} />
                      </Form.Group>                
                </Col>

                <Col xs={2}>
                     <Form.Group controlId="date_final">
                           <Form.Label>Data Final: </Form.Label>
                           <DatePicker  className="input_bootstrap" id="date_final" name="date_final" dateFormat="dd/MM/yyyy"  selected={date_final} onChange={date => setDateFinal(date)} />
                      </Form.Group>                
                </Col>

                <Col xs={2}>
                     <Form.Group controlId="tipo">
                           <Form.Label>Tipo: </Form.Label>
                           <Form.Control as="select" name="type" onChange={handleInputChange} value={values.type}  >
                                                    <option value=''>Todos</option>
                                                    <option value='1'>Pagar</option>
                                                    <option value='2'>Receber</option>
                           </Form.Control>                      
                      </Form.Group>                
                </Col>

                <Col xs={2}>
                     <Form.Group controlId="status">
                           <Form.Label>Status: </Form.Label>
                           <Form.Control as="select" name="status" onChange={handleInputChange} value={values.status}  >
                                                    <option value=''>Todos</option>
                                                    <option value='1'>Em Aberto</option>
                                                    <option value='2'>Paga</option>
                                                    <option value='3'>Cancelado</option>
                           </Form.Control>                      
                      </Form.Group>                
                </Col>

                <Col xs={2}>
                    <Button variant="dark" className="m-top" onClick={()=>submitFilter()}>
                        Buscar
                    </Button>
                </Col>

  
            </Row>
        </Form>

        
            
      </Navbar>

   </div>
      
    )
}
