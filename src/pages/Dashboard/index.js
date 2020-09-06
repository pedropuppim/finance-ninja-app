import React, {useEffect, useState} from 'react';
import Header from "../../components/Header";
import api from "./../../services/api";
import { Chart } from "react-google-charts";
import { Row, Col, Spinner } from 'react-bootstrap';
import './styles.css';

export default function Dashboard() {

    const [box_month, setBoxMonth] = useState([['','',''],[0,0,0]]);
    const [pay_month_by_category, setPayMonthByCategory] = useState([['Categorias', 'Valor'],['',0]]);
    const [pay_month_by_companies, setPayMonthByCompanies] = useState([['','',''],[0,0,0]]);
    const [receive_month_by_companies, setReceiveMonthByCompanies] = useState([['','',''],[0,0,0]]);
    const [flow_month, setFlowMonth] = useState([['','',''],[0,0,0]]);

    useEffect(() => {
        
        loadBoxMonth();
        loadPayMonthByCategory();
        loadPayMonthByCompany();
        loadReceiveMonthByCompany();
        loadFlowMonth();
        
        // eslint-disable-next-line
        }, []);

    async function loadFlowMonth() {

        try {
        
            const response = await api.get("/dashboard/flow_month");

            var rel_data = [['Dia', 'A Pagar', 'A receber', 'Saldo']];

            function getData(element) {
                var balance = element.receive - element.pay;
                rel_data.push([element.day, element.pay, element.receive, balance])
            }

            response.data.forEach(getData);

            setFlowMonth(rel_data);


        } catch (error) {
            console.log(error);
        }

    }


    async function loadReceiveMonthByCompany() {

        try {
        
            const response = await api.get("/dashboard/receive_month_by_companies");

            var rel_data = [['Cliente', 'Valor', { role: 'style' }]];

            function getData(element) {
                rel_data.push([element.company_name, element.value, 'green'])
            }

            response.data.forEach(getData);

            setPayMonthByCompanies(rel_data);

        } catch (error) {
            console.log(error);
        }

    }

    async function loadPayMonthByCompany() {

    
        try {
      
            const response = await api.get("/dashboard/pay_month_by_companies");

            var rel_data = [['Fornecedor', 'Valor', { role: 'style' }]];

            function getData(element) {
                rel_data.push([element.company_name, element.value, 'red'])
            }

            response.data.forEach(getData);
            setReceiveMonthByCompanies(rel_data);


        } catch (error) {
            console.log(error);
        }

    }

    async function loadPayMonthByCategory() {

        
        try {

            const response = await api.get("/dashboard/pay_month_by_category");

            var rel_data = [['Categorias', 'Valor']];
            function getData(element) {
               rel_data.push([element.category_name, element.value])
            }

            response.data.forEach(getData);
            setPayMonthByCategory(rel_data);

        } catch (error) {
            console.log(error);
        }

    }
    async function loadBoxMonth() {

      
        try {

            var pay, receive, balance = 0;
            const response = await api.get("/dashboard/box_month");

            function getData(element) {

                if (element.type && element.type==="1"){
                    pay = element.value;
                }

                if (element.type && element.type==="2"){
                    receive = element.value;
                }

            }

            response.data.forEach(getData);

            balance = receive - pay;


            setBoxMonth([
                ['Tipo', 'Valor',{ role: 'style' }],
                ['Pagar', pay, 'red'],
                ['Receber', receive, 'blue'],
                ['Saldo', balance, 'green'],
            ]);


        } catch (error) {
            console.log(error);
        }

    }


        return (

            <div>
                <Header />


                <div className="container_bill">

                <Row>
                    <Col>

       
                        <Chart
                            width={400}
                            height={300}
                            colors= {['#e0440e', '#e6693e', '#ec8f6e']}
                            chartType="ColumnChart"
                            loader={<Spinner animation="grow" className='spinner' />}
                            data={box_month}
                            options={{
                            title: 'Caixa do mês',
                            chartArea: { width: '100%' },

                            }}
                            legendToggle
                        />
          
                        </Col>
                        <Col>
                        <Chart
                            width={400}
                            height={300}
                            chartType="PieChart"
                            loader={<Spinner animation="grow" className='spinner' />}
                            data={pay_month_by_category}
                            options={{
                                title: 'Despesas por Categoria no mês',
                                chartArea: { width: '100%' },
                            }}
                            rootProps={{ 'data-testid': '1' }}
                            />
                        </Col>
                </Row>

     
                <Row>
                <Chart
                        width={'900px'}
                        height={'300px'}
                        chartType="LineChart"
                        loader={<Spinner animation="grow" className='spinner' />}
                        data={flow_month}
                        options={{
                            title: 'Fluxo do mês',
                        }}
                        />
                </Row>

                <Row>
                    <Col>
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="BarChart"
                            loader={<Spinner animation="grow" className='spinner' />}
                            data={receive_month_by_companies}
                            options={{
                                title: 'A pagar por Fornecedores',
                                chartArea: { width: '100%' },
                                vAxis: {
                                    title: 'Fornecedores',
                                },
                            }}
                       
                            />
                    </Col>
                <Col>

                <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="BarChart"
                            loader={<Spinner animation="grow" className='spinner' />}
                            data={pay_month_by_companies}
                            options={{
                                title: 'Entradas por Cliente',
                                chartArea: { width: '100%' },
                                vAxis: {
                                    title: 'Clientes',
                                },
                            }}
                         
                            />
                </Col>
                </Row>

              
                </div>

            </div>

        );
    }
