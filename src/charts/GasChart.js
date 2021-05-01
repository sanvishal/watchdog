import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "../config/firebaseConfig";
import { firebaseRefPaths } from "../config/dbConstants";
import { getDatabasePath } from "../utils/helpers";
import { Line } from "react-chartjs-2";
import { AlertTriangle, TrendingUp } from "react-feather";

const options = {
  responsive: true,
  // maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: true,
      },
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

class GasChart extends React.Component {
  constructor() {
    super();
    this.chartReference = React.createRef();
  }

  state = {
    isConnected: false,
    firebaseDatabase: null,
    altitudeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    altitudeLabel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    altitudeChart: {
      labels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      datasets: [
        {
          label: "Loading",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
  };

  changeLabel() {
    let datasetsCopy = this.state.altitudeChart.datasets.slice(0);
    let dataCopy = datasetsCopy[0].label.slice(0);
    dataCopy = this.props.name;
    datasetsCopy[0].label = dataCopy;
    this.setState({
      altitudeChart: { ...this.state.altitudeChart, datasets: datasetsCopy },
    });
  }

  componentDidMount = async () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    } else {
      firebase.app();
    }

    this.changeLabel();

    this.setState({
      firebaseDatabase: firebase.database(),
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.firebaseDatabase !== nextState.firebaseDatabase) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if(prevProps.doConnect !== this.props.doConnect) {
          if(this.props.doConnect) {
              this.connect();
          }
      }
  }

  queueValues(array, item, length) {
    if (array.unshift(item) > length) {
      array.pop();
      return array;
    }
    return array;
  }

  prepareChartData(dataArray, labelArray) {
    let datasetsCopy = this.state.altitudeChart.datasets.slice(0);
    let dataCopy = datasetsCopy[0].data.slice(0);
    dataCopy = dataArray;
    datasetsCopy[0].data = dataCopy;

    let labelsCopy = this.state.altitudeChart.labels.slice(0);
    labelsCopy = labelArray;

    this.setState(
      {
        altitudeChart: {
          ...this.state.altitudeChart,
          datasets: datasetsCopy,
          labels: labelsCopy,
        },
      },
      () => {
        this.chartReference.chartInstance.update();
      }
    );
  }

  connect = async () => {
    try {
      const { firebaseDatabase } = this.state;

      await firebaseDatabase
        .ref(getDatabasePath(firebaseRefPaths.gas))
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            console.log(val);
            let altitudeDataqueue = this.queueValues(
              this.state.altitudeData,
              Number(val),
              10
            );
            let altitudeLabelqueue = this.queueValues(
              this.state.altitudeLabel,
              new Date().getHours() +
                ":" +
                new Date().getMinutes() +
                ":" +
                new Date().getSeconds(),
              10
            );
            this.prepareChartData(altitudeDataqueue, altitudeLabelqueue);
          }
        });

      this.setState({ isConnected: true });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    if (this.state.isConnected) {
      return (
        <React.Fragment>
          <div class="chart">
            <div class="title">{this.props.name}</div>
            <Line
              ref={(reference) => (this.chartReference = reference)}
              data={this.state.altitudeChart}
              options={options}
            />
          </div>
          <div class="bottom-lables">
            <div class="realtime-value badge">
              <div class="title">
                Realtime Value
                </div>
              <div class="value">
                51.4
                  <span class="unit"> °C</span>
              </div>
              <div class="trend">
                <TrendingUp />
                <span class="value">+3.2 °C</span>
              </div>
            </div>
            <div class="realtime-status badge">
              <div class="title">
                Realtime Status
              </div>
              <div class="status-container">
                <div class="status-icon">
                  <AlertTriangle />
                </div>
                <div class="status">
                  <div class="title">Warning</div>
                  <div class="sub-title">Temperature Exceeding Room temperature</div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <div>
        loading...please connect
      </div>
    );
  }
}

export default GasChart;
