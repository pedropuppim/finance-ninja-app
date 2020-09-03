import React from 'react';
import Header from "../../components/Header";
import './styles.css';
import { Chart } from "react-google-charts";
import { Row, Col } from 'react-bootstrap';

export default function Dashboard() {

        
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
                            loader={<div>Carregando</div>}
                            data={[
                            ['Tipo', 'Valor',{ role: 'style' }],
                            ['Pagar', 2792000, 'red'],
                            ['Receber', 3792000, 'blue'],
                            ['Saldo', 1792000, 'green'],

                            ]}
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
                            loader={<div>Carregando</div>}
                            data={[
                                ['Categorias', 'Valor'],
                                ['Aluguel', 9],
                                ['Educação', 2],
                                ['Lazer', 2],
                                ['Reserva', 7],
                            ]}
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
                        loader={<div>Carregando</div>}
                        data={[
                            ['x', 'A Pagar', 'A receber'],
                            [0, 0, 1],
                            [1, 10, 3],
                            [2, 20, 6],
                            [3, 2, 7],
                            [4, 30, 3],
                            [5, 10, 4],
                            [6, 2, 1],
                            [7, 23, 4]
                        ]}
                        options={{
                            title: 'Fluxo do mês',
                        }}
                        rootProps={{ 'data-testid': '1' }}
                        />
                </Row>

                <Row>
                    <Col>
                        <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="BarChart"
                            loader={<div>Carregando</div>}
                            data={[
                                ['City', '2010 Population', { role: 'style' }],
                                ['New York City, NY', 8175000, 'red'],
                                ['Los Angeles, CA', 3792000, 'red'],
                                ['Chicago, IL', 2695000, 'red'],
                                ['Houston, TX', 2099000, 'red'],
                                ['Philadelphia, PA', 1526000, 'red'],
                            ]}
                            options={{
                                title: 'Saìdas por Fornecedores',
                                chartArea: { width: '100%' },
                                hAxis: {
                                title: 'Total Population',
                                minValue: 0,
                                },
                                vAxis: {
                                title: 'City',
                                },
                            }}
                            // For tests
                            rootProps={{ 'data-testid': '1' }}
                            />
                    </Col>
                <Col>

                <Chart
                            width={'400px'}
                            height={'300px'}
                            chartType="BarChart"
                            loader={<div>Carregando</div>}
                            data={[
                                ['City', '2010 Population', { role: 'style' }],
                                ['New York City, NY', 8175000, 'blue'],
                                ['Los Angeles, CA', 3792000, 'blue'],
                                ['Chicago, IL', 2695000, 'blue'],
                                ['Houston, TX', 2099000, 'blue'],
                                ['Philadelphia, PA', 1526000, 'blue'],
                            ]}
                            options={{
                                title: 'Entradas por Cliente',
                                chartArea: { width: '100%' },
                                hAxis: {
                                title: 'Total Population',
                                minValue: 0,
                                },
                                vAxis: {
                                title: 'City',
                                },
                            }}
                            // For tests
                            rootProps={{ 'data-testid': '1' }}
                            />
                </Col>
                </Row>

              
                </div>

            </div>

        );
    }
