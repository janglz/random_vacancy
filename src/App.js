import Spinner from './spinner.js';
import SelectCity from './SelectCity.js'
import './App.css';
import React from 'react';

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
        <p>Регион: <span className="bold">{this.props.selectCity}</span></p>
        {/* <div></div> */}
        
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
      cities: null,
      city: {
        name: 'Москва',
        code: 7700000000000
      },
      vacancies: [],
      currentVacancy: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.getCities = this.getCities.bind(this);
  }

  static defaultProps = {
    city: {
      name: 'Москва',
      code: 7700000000000
    }
  };

  async getCities() {
    const cities = [];
    const data = await fetch(`https://opendata.trudvsem.ru/api/v1/vacancies?text=frontend`).
    then(response => response.json());
    data.results.vacancies.forEach(vacancy => {
      const city = {
        'code': vacancy.vacancy.region['region_code'],
        'name': vacancy.vacancy.region.name
      }
      cities.push(city);
    })
    return cities.filter((city,i)=>cities.findIndex(currentCity=>(city.code === currentCity.code))===i)
  }

  async getVacancies(city) {
    const data = await fetch(`https://opendata.trudvsem.ru/api/v1/vacancies/region/${city.code}?text=frontend`).
    then(result => result.json()).then(result=>result);
    return data;
  }
  
  async handleClick(city = this.state.city) {
    this.setState({
      loading: true,
    })
    const cities = await this.getCities();
    const data = await this.getVacancies(city);
    const vacancies = [];
    data.results.vacancies.forEach(vacancy => vacancies.push(vacancy))
    this.setState({
      loading: false,
      cities: cities,
      city: city,
      vacancies: vacancies,
      currentVacancy: vacancies[Math.floor(Math.random() * vacancies.length)].vacancy
    })
  }

  componentDidMount() {
    this.handleClick()
  }

  render() {
    if (this.state.loading) return <Spinner />

    const city = this.state.city
    const element = (<SelectCity className="inline" vacancies={this.state.vacancies} cities={this.state.cities} city={city} onHandleClick={this.handleClick}/>)
    return (
      <div>
      <div className="container">
        <div className="line__wrap">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1>Случайная frontend-вакансия</h1>
        <Vacancy
          title={this.state.currentVacancy['job-name']}
          salary={this.state.currentVacancy.salary}
          region={this.state.city.name}
          url={this.state.currentVacancy['vac_url']}
          description={this.state.currentVacancy.duty}
          id={this.state.currentVacancy.id}
          selectCity={element}
        />
        <button className="button moving-bg" onClick={() => this.handleClick(this.state.city)}>Ещё вакансия!</button>
      </div>
      <p>Найдено вакансий в регионе: {this.state.vacancies.length}</p>
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