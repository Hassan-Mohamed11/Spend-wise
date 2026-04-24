import React from "react";
import { useEffect, useState } from "react";
import SpendingByDaysChart from "../spendingByDayChart";
import "../expensesAnalytics.css"


export default function Analytics() {

    const [expenses, setExpenses] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([])
    const [topThree, setTopThree] = useState([]);

    useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    
    if (savedExpenses) {
        const allExpenses = JSON.parse(savedExpenses);
        
        // Sort and get top 3 INSIDE the if block
        const top3 = [...allExpenses].sort((a, b) => b.amount - a.amount).slice(0, 3);
        
        setTopThree(top3); // Update the state
    }
}, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatNumber = (num) => {
        return num.toLocaleString('en-US').replace(/,/g, ', ');
    };

    useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedExpenses) {
      const allExpenses = JSON.parse(savedExpenses);
      
      // Category colors
      const categoryColors = {
        'Shopping': '#F4B940',
        'Groceries': '#4169E1',
        'Hangouts': '#50C878',
        'Bills': '#C84B4B',
        'Transport': '#9B59B6',
        'Other': '#EBFF7B',
        'Health': '#50E2E2'
      };
      
      // Group expenses by category and sum amounts
      const categoryTotals = {};
      
      allExpenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
      });
      
      // Convert to array format
      const expenseData = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        color: categoryColors[category] || '#999'
      }));
      
      setExpenses(expenseData);
    }
  }, []);

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calculate segments for donut chart with gaps
  const radius = 80;
  const strokeWidth = 12;
  const center = 100;
  const numberOfSegments = expenses.length;
  const gapAngle = 12; // Gap between segments in degrees
  const totalGapAngle = gapAngle * numberOfSegments;
  const availableAngle = 360 - totalGapAngle; // Total angle available for segments
  
  let currentAngle = -90; // Start from top
  
  const segments = expenses.map((expense) => {
    const percentage = expense.amount / total;
    const segmentAngle = percentage * availableAngle; // Use only available angle
    const startAngle = currentAngle;
    const endAngle = currentAngle + segmentAngle;
    
    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate arc path
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    const largeArc = segmentAngle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
    ].join(' ');
    
    currentAngle = endAngle + gapAngle; // Move to next segment with gap
    
    return {
      ...expense,
      pathData,
      percentage: (percentage * 100).toFixed(1)
    };
  });

  const groceriesSegment = segments.find(seg => seg.category === 'Groceries');
  const shoppingSegment = segments.find(seg => seg.category === 'Shopping');
  const hangoutsSegment = segments.find(seg => seg.category === 'Hangouts');
  const billsSegment = segments.find(seg => seg.category === 'Bills');
  const transportsSegment = segments.find(seg => seg.category === 'Transport');
  const healthSegment = segments.find(seg => seg.category === 'Health');
  const otherSegment = segments.find(seg => seg.category === 'Other');

  const [dailySpending, setDailySpending] = useState([
    { day: 'Sunday', amount: 0 },
    { day: 'Monday', amount: 0 },
    { day: 'Tuesday', amount: 0 },
    { day: 'Wednesday', amount: 0 },
    { day: 'Thursday', amount: 0 },
    { day: 'Friday', amount: 0 },
    { day: 'Saturday', amount: 0 }
  ]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedExpenses) {
      const expenses = JSON.parse(savedExpenses);
      
      // Initialize totals for each day
      const dayTotals = {
        'Sunday': 0,
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0
      };
      
      // Sum expenses by day of week
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        dayTotals[dayName] += expense.amount;
      });
      
      // Convert to array format
      const dailyData = Object.entries(dayTotals).map(([day, amount]) => ({
        day,
        amount
      }));
      
      setDailySpending(dailyData);
    }
  }, []);

  // Find max value for scaling
  const maxAmount = Math.max(...dailySpending.map(d => d.amount), 1);
  const chartHeight = 300;
  const chartWidth = 600;
  const barWidth = 60;
  const gap = 25;


    return(
        <div className="w-100 px-2 py-0 px-lg-5 py-3">
            <h1 className="d-none d-lg-flex">Expenses Analytics</h1>
            <div style={{backgroundColor: "white"}} className="rounded-4 p-3 shadow-sm d-flex flex-column align-items-center flex-xl-row justify-content-evenly">
                <div className="d-flex align-items-center justify-content-center w-50">
                    <div className="p-4 rounded-4 d-flex flex-column flex-lg-row align-items-center align-items-center" style={{ maxWidth: '500px' }}>
                        
                        {/* Donut Chart */}
                        <div className="d-flex justify-content-center mb-4">
                            <svg width="340" height="340" viewBox="0 0 200 200">
                                {segments.map((segment, index) => (
                                <path
                                    key={index}
                                    d={segment.pathData}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                />
                                ))}
                                
                                {/* Center text */}
                                <text
                                x="100"
                                y="95"
                                textAnchor="middle"
                                fontSize="28"
                                fontWeight="600"
                                fill="#333"
                                >
                                {total.toLocaleString()}
                                </text>
                                <text
                                x="100"
                                y="115"
                                textAnchor="middle"
                                fontSize="14"
                                fill="#666"
                                >
                                Expenses
                                </text>
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="d-flex flex-row flex-lg-column flex-wrap justify-content-center">
                        {segments.map((segment, index) => (
                            <div key={index} className="">
                                <div className="d-flex align-items-center p-2 rounded">
                                    <div
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: segment.color,
                                        marginRight: '8px',
                                        flexShrink: 0
                                    }}
                                    />
                                    <div className="d-flex flex-column" style={{ minWidth: 0 }}>
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{segment.category}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                <div className="categories d-flex flex-column align-items-center gap-1">
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#AFC2FF"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#315DED", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#315DED"}} className="mx-2 m-0">Groceries</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{groceriesSegment ? groceriesSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#FFDE97"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#B47B00", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#B47B00"}} className="mx-2 m-0">Shopping</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{shoppingSegment ? shoppingSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#C3FFB4"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#369E1C", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#369E1C"}} className="mx-2 m-0">Hangouts</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{hangoutsSegment ? hangoutsSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#FFB2B2"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#D04D4D", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#D04D4D"}} className="mx-2 m-0">Bills</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{billsSegment ? billsSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#DDC2FF"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#6C3BA9", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#6C3BA9"}} className="mx-2 m-0">Transports</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{transportsSegment ? transportsSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#B5FFFF"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#009D9D", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#009D9D"}} className="mx-2 m-0">Health</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{healthSegment ? healthSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                    <div className="spending-category d-flex align-items-center p-2 px-4 rounded-3 w-75 justify-content-between" style={{backgroundColor: "#F8FFD3"}}> 
                        <div className="d-flex align-items-center">
                            <div style={{backgroundColor: "#AFCE00", marginRight: "16px"}} className="dot"></div>
                            <h3 style={{color: "#AFCE00"}} className="mx-2 m-0">Other</h3>
                        </div>
                        <div className="amount p-2 rounded-2">
                            <h5 className="m-0 fw-semibold">{otherSegment ? otherSegment.amount.toLocaleString() : 0} <span style={{fontSize: "14px"}}>EGP</span></h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-100 h-50 d-flex flex-column flex-xxl-row gap-4 my-3'>
                <div style={{backgroundColor: "white"}} className="d-flex flex-column justify-content-start rounded-4 w-100 w-lg-50 p-3 shadow">
                    <div>
                        <h3>Highest expenses</h3>
                        <hr />
                    </div>
                    <div>
                        {topThree.length > 0 ? (
                            topThree.map((expense) => {
                                return(
                                    <div key={expense.id} className="recent-expense d-flex justify-content-between p-2 p-md-3 w-100 align-items-center mb-2">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex align-items-center mb-1">
                                                <h3 className="recent-expense-item m-0">{expense.item}</h3>
                                                <h3 className="recent-expense-category m-0 mx-1 mx-lg-1 p-1 p-lg-2 rounded-2">{expense.category}</h3>
                                            </div>
                                            <h3 className="recent-expense-date m-0 fw-light">{formatDate(expense.date)}</h3>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <h2 className="recent-expense-number m-0 text-danger mx-2">- {formatNumber(expense.amount)} <span>EGP</span></h2>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className='text-center py-4 text-muted'>
                                <p>No expenses yet</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white p-3 rounded-4 shadow-sm w-100 w-lg-50">
                    <div>
                        <h3>Spending by days</h3>
                        <hr />
                    </div>
                        <div className="d-flex justify-content-center" style={{ overflowX: 'auto' }}>
                            <svg width={600} height={chartHeight + 60} style={{ minWidth: '600px' }}>
                            {/* Horizontal grid lines */}
                            {[0, 500, 1000, 1500, 2000, 2500, 3000].map((value, index) => {
                                const y = chartHeight - (value / maxAmount) * chartHeight;
                                return (
                                <g key={index}>
                                    <line
                                    x1="0"
                                    y1={y}
                                    x2={chartWidth}
                                    y2={y}
                                    stroke="#e0e0e0"
                                    strokeDasharray="5,5"
                                    strokeWidth="1"
                                    />
                                    <text
                                    x="-5"
                                    y={y + 5}
                                    textAnchor="end"
                                    fontSize="12"
                                    fill="#999"
                                    >
                                    {value}
                                    </text>
                                </g>
                                );
                            })}
                            
                            {/* Bars */}
                            {dailySpending.map((day, index) => {
                                const barHeight = (day.amount / maxAmount) * chartHeight;
                                const x = index * (barWidth + gap) + 40;
                                const y = chartHeight - barHeight;
                                
                                return (
                                <g key={day.day}>
                                    {/* Bar */}
                                    <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={barHeight}
                                    fill="#4169E1"
                                    rx="4"
                                    />
                                    
                                    {/* Day label */}
                                    <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    fontSize="13"
                                    fill="#666"
                                    >
                                    {day.day}
                                    </text>
                                    
                                    {/* Amount label on top of bar (if there's spending) */}
                                    {day.amount > 0 && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 5}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#333"
                                        fontWeight="600"
                                    >
                                        {day.amount.toLocaleString()}
                                    </text>
                                    )}
                                </g>
                                );
                            })}
                            
                            {/* Bottom line */}
                            <line
                                x1="0"
                                y1={chartHeight}
                                x2={chartWidth}
                                y2={chartHeight}
                                stroke="#333"
                                strokeWidth="2"
                            />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
    ) 
}