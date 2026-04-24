import React, { useState, useEffect } from 'react';

function SpendingByDaysChart() {
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

}

export default SpendingByDaysChart;