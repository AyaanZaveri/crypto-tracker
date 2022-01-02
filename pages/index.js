import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import Head from "next/head";

export const Home = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [chartChange, setChartChange] = useState("30");

  console.log(
    `Currency: ${currency.toUpperCase()}\nChart Change: ${chartChange}`
  );

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
      .replace(
        /\s/g,
        "-"
      )}/market_chart?vs_currency=${currency}&days=${chartChange}`,
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

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleChartChange = (range) => {
    setChartChange(range);
  };

  useEffect(() => {
    getChartData();
  }, [chartChange]);

  return (
    <div className="flex flex-col gap-3 appearance-none">
      <Head>
        <title>Crypto Tracker</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="description" content="Crypto Dashboard" />
      </Head>

      <div className="w-screen flex dark:bg-slate-800 flex-row md:justify-start justify-center font-bold p-5 border-b text-slate-700">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="appearance-none shadow-sm text-slate-800 p-2 w-72 ml-2 border focus:border-slate-500 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring ring-slate-300 active:bg-slate-100 transition"
            autoComplete="off"
          />
        </form>
        <select
          className="appearance-none bg-white shadow-sm text-slate-800 p-2 ml-2 border focus:border-slate-500 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring ring-slate-300 active:bg-slate-100 transition"
          value={currency}
          onChange={handleCurrencyChange}
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
                ? `$${data.market_data.current_price.usd}`
                : currency == "eur"
                ? `$${data.market_data.current_price.eur}`
                : currency == "gbp"
                ? `$${data.market_data.current_price.gbp}`
                : currency == "cad"
                ? `$${data.market_data.current_price.cad}`
                : `$${data.market_data.current_price.aud}`}
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
          <div className="mt-4 flex flex-row">
            <button
              onClick={() => handleChartChange("7")}
              className={`bg-white px-2 rounded-l-md border hover:bg-slate-50 ${
                chartChange == "7" ? "bg-slate-100" : "bg-white"
              }`}
            >
              1W
            </button>
            <button
              onClick={() => handleChartChange("30")}
              className={`bg-white px-2 border-y hover:bg-slate-50 ${
                chartChange == "30" ? "bg-slate-100" : "bg-white"
              }`}
            >
              1M
            </button>
            <button
              onClick={() => handleChartChange("365")}
              className={`bg-white px-2 rounded-r-md border hover:bg-slate-50 ${
                chartChange == "365" ? "bg-slate-100" : "bg-white"
              }`}
            >
              1Y
            </button>
          </div>
          <div className="border p-2 rounded-lg shadow-sm flex flex-col justify-center align-middle items-center md:w-1/2 sm:w-full w-full mt-3">
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
                    pointRadius: 1,
                  },
                ],
              }}
            />
          </div>
          <div className="flex flex-col justify-start gap-y-2 mt-5 border md:w-1/2 sm:w-full w-full shadow-sm p-2 rounded-lg">
            <div className="flex flex-wrap flex-col gap-y-5 justify-start items-start text-slate-800 rounded-lg">
              <div className="inline-flex flex-wrap gap-y-1 align-middle items-center">
                <span className="font-semibold">Market Cap:&nbsp;</span>
                <span className="text-slate-800">
                  {currency == "usd"
                    ? `$${data.market_data.market_cap.usd}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : currency == "eur"
                    ? `$${data.market_data.market_cap.eur}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : currency == "gbp"
                    ? `$${data.market_data.market_cap.gbp}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : currency == "cad"
                    ? `$${data.market_data.market_cap.cad}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : `$${data.market_data.market_cap.aud}`
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
                <span className="mb-0.5">
                  {caretValue(
                    data.market_data.market_cap_change_percentage_24h
                  )}
                </span>
                <span className="text-sm px-1.5 ring-1 ml-1 ring-slate-200 text-slate-500 rounded dark:ring-slate-600 shadow-sm">
                  {Math.round(
                    data.market_data.market_cap_change_percentage_24h * 100
                  ) / 100}
                  %
                </span>
              </div>
            </div>

            <div className="inline-flex align-middle items-center">
              <span className="font-semibold">All Time High:&nbsp;</span>
              <span className="text-slate-800">
                {currency == "usd"
                  ? `$${data.market_data.ath.usd}`
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : currency == "eur"
                  ? `$${data.market_data.ath.eur}`
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : currency == "gbp"
                  ? `$${data.market_data.ath.gbp}`
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : currency == "cad"
                  ? `$${data.market_data.ath.cad}`
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : `$${data.market_data.ath.aud}`
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
