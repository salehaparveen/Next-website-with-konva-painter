import { Fragment, React } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

export default function GraphEstimateByDay() {
  const data = {
    labels: ["x", "y"],
    datasets: [
      {
        data: [1, 5],
      },
    ],
  };

  return (
    <Fragment>
      <Bar
        data={data}
        width={400}
        height={200}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </Fragment>
  );
}
