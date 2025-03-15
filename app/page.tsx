"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(JSON.stringify(dummyData, null, 2));
  const [showGraph, setShowGraph] = useState(false);
  const [summaryList, setSummary] = useState([] as { title: string, summary: Summary[], total: Summary }[]);
  const [page, setPage] = useState(0)

  function handleVisualize() {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.length >= 2) {
        setSummary(transform(parsedData));
        setShowGraph(true);
      } else {
        alert('Please provide at least 2 months of data');
      }
    } catch (error) {
      alert('Invalid JSON data');
    }
  }

  return (
    <div className="flex-1 flex flex-col items-start justify-items-center min-h-screen sm:p-8 text-foreground">
      {!showGraph ? (
        <>
          <button
            onClick={handleVisualize}
            className="px-4 py-2 rounded-md border-2 border-foreground text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
          >
            Grafiği Göster
          </button>
          <span className="text-foreground text-lg">
            Aşağıdaki formatta girdiyi doldurun ve grafiği görmek için tıklayın
          </span>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={`w-full p-4 border-2 border-foreground rounded-md text-xl min-h-[calc(100vh-16rem)]`}
          />
        </>
      )
        : (
          <div className="w-full">
            {summaryList.map(({ title, summary, total }, index) => {
              if (index !== page) return null;
              return (
                <div key={index} className="flex flex-col w-full  mx-auto  ">
                  <div className="flex justify-between mb-4 p-2">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <div className="flex  gap-4">
                      {page > 0 && (
                        <button
                          onClick={() => { setPage(page - 1) }}
                          className="mt-4 px-4 py-2 rounded-md border-2 border-foreground text-foreground"
                        >
                          {summaryList[page - 1].title}

                        </button>
                      )}
                      {page < summaryList.length - 1 && (
                        <button
                          onClick={() => { setPage(page + 1) }}
                          className="mt-4 px-4 py-2 rounded-md border-2 border-foreground text-foreground"
                        >
                          {summaryList[page + 1].title}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto ">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-background">
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200">Bank</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200">İsim</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200 text-blue-600">Adet</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200 text-green-600">Son Birim Fiyat</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200 text-green-600">Son Toplam Tutar</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200 text-blue-600">Güncel Birim Fiyat</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200 text-blue-600">Güncel Toplam Tutar</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200">Kar/Zarar</th>
                          <th className=" border border-gray-200 p-2 min-w-[100px] h-9 font-semibold hover:bg-gray-200">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.map((item) => {
                          return (
                            <StockRow
                              key={`${item.bank}-${item.name}`}
                              summary={item}
                            />
                          );
                        })}

                        <tr className="border-t-2 border-foreground font-bold">
                          <td className="p-2" colSpan={2}>TOPLAM</td>
                          <td className=" border border-gray-200 p-2 min-w-[100px] h-9"></td>
                          <td className=" border border-gray-200 p-2 min-w-[100px] h-9"></td>
                          <td className=" border border-gray-200 p-2 min-w-[100px] h-9">{total.lastTotal.toFixed(2)}</td>
                          <td className=" border border-gray-200 p-2 min-w-[100px] h-9"></td>
                          <td className=" border border-gray-200 p-2 min-w-[100px] h-9">{total.currentTotal.toFixed(2)}</td>
                          <td className={` border border-gray-200 p-2 min-w-[100px] h-9 ${total.differenceTotal > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {`${total.differenceTotal.toFixed(2)}`}
                          </td>
                          <td className={` border border-gray-200 p-2 min-w-[100px] h-9 ${total.differencePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {`${total.differencePercent.toFixed(2)}%`}
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              )
            }
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowGraph(false);
                }}
                className="mt-4 px-4 py-2 rounded-md border-2 border-foreground text-foreground"
              >
                Girdiyi Düzenle
              </button>

            </div>
          </div>
        )
      }
    </div >
  );
}

type Summary = {
  bank: string;
  name: string;
  amount: number;
  lastUnitPrice: number;
  lastTotal: number;
  currentUnitPrice: number;
  currentTotal: number;
  differenceTotal: number;
  differencePercent: number;
}

function transform(data: MonthData[]) {
  return data.reduce((acc, month, index, array) => {
    if (index === 0) return acc;
    const previousMonth = array[index - 1];
    const title = `${month.date} Õzeti`;
    const summary = month.data.map(item => {
      const previousItem = previousMonth.data.find(i => i.name === item.name && i.bank === item.bank);
      if (!previousItem) {
        return {
          bank: item.bank,
          name: item.name,
          amount: item.amount,
          lastUnitPrice: item.unitPrice,
          lastTotal: item.amount * item.unitPrice,
          currentUnitPrice: item.unitPrice,
          currentTotal: item.amount * item.unitPrice,
          differenceTotal: 0,
          differencePercent: 0
        }
      }
      const lastTotal = item.amount * previousItem.unitPrice;
      const currentTotal = item.amount * item.unitPrice;
      const difference = Math.round(currentTotal - lastTotal);
      const change = Math.round(100 * difference / lastTotal);
      return {
        bank: item.bank,
        name: item.name,
        amount: item.amount,
        lastUnitPrice: previousItem?.unitPrice ?? item.unitPrice,
        lastTotal: lastTotal,
        currentUnitPrice: item.unitPrice,
        currentTotal: currentTotal,
        differenceTotal: difference,
        differencePercent: change
      }
    })
    const summaryLastTotal = summary.reduce((acc, item) => acc + item.lastTotal, 0)
    const summaryCurrentTotal = summary.reduce((acc, item) => acc + item.currentTotal, 0)
    const total = {
      bank: 'TOPLAM',
      name: '',
      amount: 0,
      lastUnitPrice: 0,
      lastTotal: summaryLastTotal,
      currentUnitPrice: 0,
      currentTotal: summaryCurrentTotal,
      differenceTotal: Math.round(summaryCurrentTotal - summaryLastTotal),
      differencePercent: Math.round((summaryCurrentTotal - summaryLastTotal) / summaryLastTotal * 100)
    }
    acc.push({
      title: title,
      summary: summary,
      total: total
    });

    return acc
  }, [] as { title: string, summary: Summary[], total: Summary }[]);
}

const dummyData = [
  {
    "date": "2025-01-03",
    "data": [
      { "bank": "bank 1", "name": "stock share 1", "amount": 100, "unitPrice": 20.60 },
      { "bank": "bank 1", "name": "stock share 2", "amount": 50, "unitPrice": 70.00 },
      { "bank": "bank 1", "name": "stock share 3", "amount": 1000, "unitPrice": 5.50 },
      { "bank": "bank 2", "name": "stock share 4", "amount": 24, "unitPrice": 44.75 },
      { "bank": "bank 2", "name": "stock share 5", "amount": 5, "unitPrice": 234.66 },
      { "bank": "bank 2", "name": "stock share 6", "amount": 1000, "unitPrice": 4.33 },
    ]
  },
  {
    "date": "2025-02-04",
    "data": [
      { "bank": "bank 1", "name": "stock share 1", "amount": 100, "unitPrice": 21.60 },
      { "bank": "bank 1", "name": "stock share 2", "amount": 60, "unitPrice": 68.90 },
      { "bank": "bank 1", "name": "stock share 3", "amount": 1100, "unitPrice": 5.34 },
      { "bank": "bank 2", "name": "stock share 4", "amount": 30, "unitPrice": 45.75 },
      { "bank": "bank 2", "name": "stock share 5", "amount": 10, "unitPrice": 224.66 },
      { "bank": "bank 2", "name": "stock share 6", "amount": 1050, "unitPrice": 4.89 },
      { "bank": "bank 2", "name": "stock share 7", "amount": 200, "unitPrice": 14.10 },
    ]
  },
  {
    "date": "2025-03-02",
    "data": [
      { "bank": "bank 1", "name": "stock share 1", "amount": 120, "unitPrice": 21.40 },
      { "bank": "bank 1", "name": "stock share 2", "amount": 65, "unitPrice": 71.20 },
      { "bank": "bank 1", "name": "stock share 3", "amount": 1100, "unitPrice": 5.71 },
      { "bank": "bank 2", "name": "stock share 4", "amount": 50, "unitPrice": 49.12 },
      { "bank": "bank 2", "name": "stock share 5", "amount": 10, "unitPrice": 224.66 },
      { "bank": "bank 2", "name": "stock share 6", "amount": 1150, "unitPrice": 4.50 },
      { "bank": "bank 2", "name": "stock share 7", "amount": 200, "unitPrice": 14.20 },
      { "bank": "bank 1", "name": "fond 1", "amount": 2000, "unitPrice": 1.12 },
    ]
  }
]

// Add these interfaces at the top of the file, after the imports
interface StockItem {
  bank: string;
  name: string;
  amount: number;
  unitPrice: number;
}

interface MonthData {
  date: string;
  data: StockItem[];
}

interface StockRowProps {
  summary: Summary;
}

export function StockRow({ summary }: StockRowProps) {

  return (
    <tr className="border-b border-foreground/20">
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50">{summary.bank}</td>
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50">{summary.name}</td>
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50 text-blue-600">{summary.amount}</td>
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50">{summary.lastUnitPrice.toFixed(2)}</td>
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50">{summary.lastTotal.toFixed(2)}</td>
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50">{summary.currentUnitPrice.toFixed(2)}</td>
      <td className=" border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50">{summary.currentTotal.toFixed(2)}</td>
      <td className={` border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50 ${summary.differenceTotal > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {summary.differenceTotal}
      </td>
      <td className={` border border-gray-200 p-2 min-w-[100px] h-9 hover:bg-gray-50 ${summary.differencePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {`${summary.differencePercent.toFixed(2)}%`}
      </td>

    </tr>
  );
}