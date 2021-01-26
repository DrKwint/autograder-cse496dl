import React from "react";

import { Container } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


import styles from './style.scss';

const cellClassName = (params) => {
    if (params.row.err_msg) {
        return 'error';
    }
};

const columns = [
    { field: 'name', headerName: 'Team Name', flex: 1 },
    { field: 'score', headerName: 'Score', type: 'number', width: 120, cellClassName: cellClassName },
    { field: 'firsts', headerName: 'Firsts', type: 'number', width: 120 },
    { field: 'seconds', headerName: 'Seconds', type: 'number', width: 140 },
    { field: 'thirds', headerName: 'Thirds', type: 'number', width: 125 },
    { field: 'valid_submissions', headerName: 'Valid Submissions', type: 'number', width: 200 },
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = { err_msg: '' };
    }

    componentDidMount() {
        this.props.fetchScoreData();
    }

    rowSelected(e) {
        const data = e.data;
        this.setState({
            err_msg: data.err_msg || ''
        });
    }

    render() {
        let i = 0;
        const scoreData = this.props.scoreData.toJS().map(x => {
            x['id'] = i++;
            return x;
        });

        return (
            <Container maxWidth="lg">
                {this.props.retrievingData ?
                 <div>Loading</div>
                :
                 <div style={{ display: 'flex', height: '500px', marginTop: '1rem' }}>
                     <div style={{ flexGrow: 1 }}>
                         <DataGrid
                             rows={scoreData}
                             columns={columns}
                             sortModel={[
                                 {
                                     field: 'score',
                                     sort: 'desc',
                                 },
                             ]}
                             onRowSelected={(e) => {this.rowSelected(e);}}
                         />
                     </div>
                 </div>
                }
                {
                    this.state.err_msg !== '' ? (
                        <Card style={{ marginTop: '1rem' }}>
                            <CardContent>
                                <h3>Error Message:</h3>
                                <pre>
                                    {this.state.err_msg}
                                </pre>
                            </CardContent>
                        </Card>
                    ) : null
                }

            </Container>
        );
    }
}

export default Dashboard;
