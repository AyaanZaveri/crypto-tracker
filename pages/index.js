import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Line } from "react-chartjs-2";

export const Home = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState("usd");

  console.log(currency);

  var config = {
    method: "get",
    url: `https://api.coingecko.com/api/v3/coins/${search
      .toLowerCase()
      .replace(/\s/g, "-")}`,
    headers: {},
  };

  var chartConfig = {
    method: "get",
    url: `https://api.coingecko.com/api/v3/coins/${search
      .toLowerCase()
      .replace(/\s/g, "-")}/market_chart?vs_currency=${currency}&days=14`,
    headers: {},
  };

  const getCryptoData = () => {
    axios(config)
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const getChartData = () => {
    axios(chartConfig)
      .then(function (response) {
        setChartData(response.data);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const unixToDate = (unix) => {
    return new Date(unix).toLocaleDateString("en-US");
  };

  let labels = [];
  let dataY = [];

  if (chartData.prices) {
    chartData.prices.map(
      (item) => labels.push(unixToDate(item[0])) && dataY.push(item[1])
    );
  }

  console.log(labels);

  const handleSubmit = (e) => {
    e.preventDefault();
    getCryptoData();
    getChartData();
  };

  const colorValue = (value) => {
    if (value > 0) {
      return "#10b981";
    } else if (value < 0) {
      return "#f43f5e";
    }
  };

  const caretValue = (value) => {
    if (value > 0) {
      return <FaCaretUp className="text-emerald-500 mt-0.5" />;
    } else if (value < 0) {
      return <FaCaretDown className="text-rose-500 mt-0.5" />;
    }
  };

  const handleChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 appearance-none">
      <div className="w-screen flex flex-row md:justify-start justify-center font-bold p-5 border-b text-slate-700">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="appearance-none shadow-sm text-slate-800 p-2 w-72 ml-2 border rounded-lg hover:bg-slate-50 focus:outline-none transition-colors"
            autoComplete="off"
          />
        </form>
        <select
          className="outline-none appearance-none shadow-sm text-slate-800 p-2 ml-2 border rounded-lg hover:bg-slate-50 focus:outline-none transition-colors"
          value={currency}
          onChange={handleChange}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
          <option value="cad">CAD</option>
          <option value="aud">AUD</option>
        </select>
      </div>
      {data.id ? (
        <div className="p-4 ml-3 rounded-lg flex flex-col md:justify-start md:items-start justify-center items-center">
          <div className="flex flex-row">
            <img src={data.image.large} className="w-8 h-8 mt-1 mr-2"></img>
            <span className="text-4xl font-bold text-slate-800">
              {data.name}
            </span>
            <div className="flex ml-3 align-middle items-center justify-center">
              <span className="px-1.5 ring-1 ring-slate-200 text-slate-500 rounded dark:ring-slate-600 shadow-sm">
                {data.symbol.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex align-middle items-center justify-center">
            <span
              className={`inline-flex text-3xl font-bold mt-3 text-slate-800`}
            >
              {currency == "usd"
                ? data.market_data.current_price.usd
                : currency == "eur"
                ? data.market_data.current_price.eur
                : currency == "gbp"
                ? data.market_data.current_price.gbp
                : currency == "cad"
                ? data.market_data.current_price.cad
                : data.market_data.current_price.aud}
              {caretValue(
                data.market_data.price_change_percentage_24h_in_currency.usd
              )}
            </span>
            <span className="px-1.5 ring-1 mt-2.5 ml-1 ring-slate-200 text-slate-500 rounded dark:ring-slate-600 shadow-sm">
              {Math.round(
                data.market_data.price_change_percentage_24h_in_currency.usd *
                  100
              ) / 100}
              %
            </span>
          </div>
          <div className="border p-2 rounded-lg shadow-sm flex justify-center items-center md:w-1/2 sm:w-full w-full mt-5">
            <Line
              data={{
                labels: labels,
                datasets: [
                  {
                    label: `${data.name} (USD) Price`,
                    lineTension: 0.1,
                    backgroundColor: colorValue(
                      currency == "usd"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.usd
                        : currency == "eur"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.eur
                        : currency == "gbp"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.gbp
                        : currency == "cad"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.cad
                        : data.market_data
                            .price_change_percentage_24h_in_currency.aud
                    ),
                    borderColor: colorValue(
                      currency == "usd"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.usd
                        : currency == "eur"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.eur
                        : currency == "gbp"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.gbp
                        : currency == "cad"
                        ? data.market_data
                            .price_change_percentage_24h_in_currency.cad
                        : data.market_data
                            .price_change_percentage_24h_in_currency.aud
                    ),
                    data: dataY,
                    responsive: true,
                    pointRadius: 0,
                  },
                ],
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
