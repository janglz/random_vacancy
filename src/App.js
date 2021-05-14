import Spinner from './spinner.js';
import './App.css';
import React from 'react';

function refreshPage() {
  window.location.reload();
}

class Vacancy extends React.Component {
  render() {
    let id = 0
    const description = this.props.description.trim().
      replace(/<\/?[a-zA-Z]+>|\u2022|nbsp|&/gi, '').
      split(/\n|;/gi).
      filter(line => line.match(/\S/gi))
    const formatted = description.map((line) => <li key={id += 1}>{line}{'\n'}</li>)

    return (
      <div className="vacancy-card">
        <p>Вакансия: <span className="bold">{this.props.title}</span></p>
        <p>Зарплата: <span className="bold">{this.props.salary}</span></p>
        <p>Обязанности:</p>
        <ul>{formatted}
          <li className="justified"><a className="moving-bg" href={this.props.url}>Подробнее...</a></li>
        </ul>
      </div>
    )
  }
}

class VacancyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      vacancies: [],
      currentVacancy: null,
    };
  }

  componentDidMount() {
    fetch('http://opendata.trudvsem.ru/api/v1/vacancies/region/7700000000000?text=frontend')
      .then(result => result.json())
      .then((result) => {
        const vacancies = [];
        result.results.vacancies.forEach(vacancy => vacancies.push(vacancy))
        this.setState({
          loading: false,
          vacancies: vacancies,
          currentVacancy: vacancies[Math.floor(Math.random() * vacancies.length)].vacancy
        })
      })
  }

  render() {
    if (this.state.loading) return <Spinner />
    return (
      <div className="container">
        <div className="line__wrap">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1>Случайная frontend-вакансия в Москве:</h1>
        <Vacancy
          title={this.state.currentVacancy['job-name']}
          salary={this.state.currentVacancy.salary}
          url={this.state.currentVacancy['vac_url']}
          description={this.state.currentVacancy.duty}
          id={this.state.currentVacancy.id}
        />
        <button className="button moving-bg" onClick={refreshPage}>Ещё вакансия!</button>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <VacancyCard />
      </main>
    </div>
  );
}

export default App;