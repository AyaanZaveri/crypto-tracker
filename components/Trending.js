import React from "react";

const Trending = ({ trendingData }) => {
  return (
    <div className="rounded-lg flex flex-col md:justify-start md:items-start justify-center items-center">
      <span className="md:ml-7 ml-0 my-3 text-4xl font-bold text-slate-800">
        Trending
      </span>

      <thead className="mt-3">
        <td className="flex flex-row border-y space-x-56 py-3 w-screen">
          <span className="ml-7 font-bold text-slate-800">Name</span>
        </td>
        {trendingData.map((trending) => {
          return (
            <tr onClick={() => location.href = `/crypto/${trending.id}`} className="flex flex-row hover:bg-slate-50 hover:cursor-pointer space-x-2 py-6 border-b items-center">
              <img src={trending.image} className="w-6 h-6 ml-7" />
              <td className="font-semibold hover:underline text-lg text-slate-800">
                {trending.name}
              </td>
              <td className="px-1.5 ring-1 ring-slate-200 text-slate-500 rounded dark:ring-slate-600 shadow-sm">
                {trending.symbol.toUpperCase()}
              </td>
            </tr>
          );
        })}
      </thead>
    </div>
  );
};

export default Trending;
