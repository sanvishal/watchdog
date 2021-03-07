import React from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import firebaseConfig from '../config/firebaseConfig'
import {firebaseRefPaths} from '../config/dbConstants';
import {getDatabasePath} from '../utils/helpers';
import {Line} from 'react-chartjs-2';

const options = {
    legend: {
        display: false
    },
    scales: {
        xAxes: [
          {
            display: true
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
  }
  


class TemperatureChart extends React.Component {

    constructor() {
        super();
        this.chartReference = React.createRef();
    }

    state = {
        isConnected: false,
        firebaseDatabase: null,
        temparatureData:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        temperatureLabel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        temperatureChart: {
            labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            datasets: [
              {
                label: 'My First dataset',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              }
            ]
          }
    }

    componentDidMount = async() => {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
         }else {
            firebase.app();
         }

        this.setState({
            firebaseDatabase: firebase.database()
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.firebaseDatabase !== nextState.firebaseDatabase) { 
            return false;
        }

        return true;
    }


    queueValues(array, item, length) {
        console.log(array)
        if(array.unshift(item) > length) {
            array.pop();
            return array;
        }
        return array;
    }

    prepareChartData(dataArray, labelArray) {
        let datasetsCopy = this.state.temperatureChart.datasets.slice(0);
        let dataCopy = datasetsCopy[0].data.slice(0);
        dataCopy = dataArray;
        datasetsCopy[0].data = dataCopy;

        let labelsCopy = this.state.temperatureChart.labels.slice(0);
        labelsCopy = labelArray;

        this.setState({
            temperatureChart: {...this.state.temperatureChart, datasets: datasetsCopy, labels: labelsCopy}
        }, () => {
            this.chartReference.chartInstance.update();
        })
    }

    connect = async() => {
        try {
            const {firebaseDatabase} = this.state;

            await firebaseDatabase.ref(getDatabasePath(firebaseRefPaths.realAltitude)).on('value', snapshot => {
                if(snapshot.exists()) {
                    const val = snapshot.val();
                    console.log(val)
                    let temperatrueDataqueue = this.queueValues(this.state.temparatureData, Number(val), 10);
                    let temperatrueLabelqueue = this.queueValues(this.state.temperatureLabel, new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(), 10)
                    this.prepareChartData(temperatrueDataqueue, temperatrueLabelqueue)
                    // this.setState({
                    //     temparatureData: queue,
                    // }, () => {
                    //     this.prepareChartData(queue)
                    // })
                    console.log(this.state.temparatureData);
                }
            })

            this.setState({isConnected: true})
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        return <div>
            <button onClick = {this.connect}>connect</button>
                  <Line ref={(reference) => this.chartReference = reference} data={this.state.temperatureChart} options={options}/>
        </div>
    }
}

export default TemperatureChart;