import React, { useEffect, useState } from 'react';
import { Col, Row, } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const _ = require('underscore');

import { Filters } from '/imports/ui/components/form/Filters';
import { businessUnitsByCompany } from '/imports/startup/hooks';
import { callbackError, getObjectFromPeriod } from '/imports/ui/pages/utilities/utilities';
import { checkForConnection, generateConnection } from '/imports/ui/pages/utilities/ddp';

const DEFAULT_FILTERS = {
  period: 'day',
  startDate: null,
  finishDate: null,
  customWeek: '',
  customMonth: '',
  business: 'all',
};

const optionsChart = (title, max, titleY, categories, data, tooltip = '') => {
  return {
    chart: {
      type: 'column',
      zoomType: 'x',
    },
    title: {
      text: title,
    },
    yAxis: {
      min: 0,
      max: max,
      title: {
        text: titleY,
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif',
          overflow: 'justify'
        }
      },
      categories: categories
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        stacking: 'percent',
        lineColor: '#ffffff',
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: '#ffffff'
        },
      },
      column: {
        grouping: false,
        shadow: false
      }
    },
    series: [{
      data: data
    }],
    tooltip: {
      formatter: function () {
        return `${this.y} ${tooltip}`;
      }
    },
  };
}

const generateChartData = (result) => {
  const tasks = result.map(item => item.name);
  const counts = result.map(item => item.length);
  const maxCount = Math.max(...counts);
  const tooltip = 'findings';

  return optionsChart('Top 10 Resultados por frecuencia', maxCount * 1.2, 'Times', tasks, counts, tooltip);
};

const generateChartDataPercetage = (result) => {
  const finalData = result.sort((a, b) => b.percentage - a.percentage);
  const tasks = finalData.map(item => item.name);
  const counts = finalData.map(item => item.percentage);
  const maxCount = Math.max(...counts);
  const tooltip = '%';

  return optionsChart('Top 10 resultados por porcentaje de contribución', maxCount * 1.2, '%', tasks, counts, tooltip);
};

const generateChartDataLocations = (result) => {
  const newDataset = result.reduce((prev, item) => {
    return [...prev, ...item.data]
  }, []);

  console.log('newDataset', newDataset);
  const group = _.groupBy(newDataset, 'locationName');
  
  const keys = Object.keys(group);
  let finalData = keys.map(key => {
    return {
      location: key,
      count: group[key].length
    };
  });
  console.log('Fianl dayta => ', finalData);
  finalData = finalData.sort((a, b) => b.count - a.count);

  const tasks = finalData.map(item => item.location);
  const counts = finalData.map(item => item.count);
  const maxCount = Math.max(...counts);

  return optionsChart('Hallazgos - Frecuencia por Ubicación', maxCount * 1.2, 'Times', tasks, counts);
}

const generateChartDataAreas = (result) => {
  const newDataset = result.reduce((prev, item) => {
    return [...prev, ...item.data]
  }, []);

  console.log('newDataset', newDataset);
  const group = _.groupBy(newDataset, 'areaName');
  
  const keys = Object.keys(group);
  let finalData = keys.map(key => {
    return {
      location: key,
      count: group[key].length
    };
  });

  finalData = finalData.sort((a, b) => b.count - a.count);

  const tasks = finalData.map(item => item.location);
  const counts = finalData.map(item => item.count);
  const maxCount = Math.max(...counts);

  return optionsChart('Hallazgos - Frecuencia por Área', maxCount * 1.2, 'Times', tasks, counts);
}

export default Problems = props => {

  const { id } = useParams();
  const [ loading, setLoading ] = useState(false);
  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);
  const [ conection, setConection ] = useState([]);
  const [ data, setData ] = useState([]);
  const [ optionsChart, setOptionsChart ] = useState({});
  const [ optionsLocations, setOptionsLocations ] = useState({});
  const [ optionsAreas, setOptionsAreas ] = useState({});
  const [ optionsPercentage, setOptionsPercentage ] = useState({});

  const { loading: loading2, allBusiness } = businessUnitsByCompany(id);

  const updateDataAudit = (filtersData) => {
    setLoading(true);
  
    const { period, startDate, finishDate, customMonth, customWeek } = filtersData;
    const periodFilter = getObjectFromPeriod(period, customWeek, customMonth, startDate, finishDate);

    const selectedUnit = filtersData.business;

    let businessUnitToGet = allBusiness;
    if (selectedUnit && selectedUnit != 'all') {
      businessUnitToGet = businessUnits.filter(businessUnit => {
        return businessUnit._id == selectedUnit;
      });
    }
  
    // Reset
    setData([]);

    const ddpConnection = conection;
  
    ddpConnection.connection.call('get_most_failed_tasks', periodFilter, 10, businessUnitToGet, function(error, result) {
      if (error) callbackError(error);
      if (result) {
        result.company = ddpConnection.company;
        const finalData = result.map(item => {
          item.percentage = Math.round(item.length * 100 / item.coincidences);
          item.open = false;
          return item;
        });
        setData(finalData);
        const chartData = generateChartData(finalData);
        setOptionsChart(chartData);

        const chartPercentage = generateChartDataPercetage(finalData);
        setOptionsPercentage(chartPercentage);

        const chartLocations = generateChartDataLocations(finalData);
        setOptionsLocations(chartLocations);

        const chartAreas = generateChartDataAreas(finalData);
        setOptionsAreas(chartAreas);

        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const connection = generateConnection(id);
    setConection(connection);
  }, []);

  useEffect(() => {
    if (Object.values(conection).length) {
      checkForConnection(conection, updateDataAudit(filters))
    }
  }, [ conection ]);

  const updateFilters = (dataFilter) => {
    setFilters(dataFilter);
    setLoading(true);
    updateDataAudit(dataFilter);
  };

  const renderChart = (dataChart) => {
    return (
      <Col md={6} className="mb-3">
        <HighchartsReact
          highcharts={Highcharts}
          options={dataChart}
        />
      </Col>
    )
  }

  if (loading || loading2) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection
        title="Hallazgos"
        subtitle={id}
        back={true}
      />
      <section>
        <Row>
          <Filters
            filters={filters}
            handleFilter={(filters) => updateFilters(filters)}
            business={allBusiness}
          />
            {renderChart(optionsChart)}
            {renderChart(optionsPercentage)}
            {renderChart(optionsLocations)}
            {renderChart(optionsAreas)}
        </Row>
      </section>
    </>
  );
}
