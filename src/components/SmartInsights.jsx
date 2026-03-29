import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

const SmartInsights = ({ transactions, debts }) => {
    const insights = useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const thisWeekExpenses = transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= oneWeekAgo)
            .reduce((sum, t) => sum + t.amount, 0);

        const lastWeekExpenses = transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo)
            .reduce((sum, t) => sum + t.amount, 0);

        const peopleOweYou = debts
            .filter(d => d.type === 'lent') // Assuming 'lent' means they owe you
            .reduce((sum, d) => sum + d.amount, 0);

        const list = [];

        // Insight 1: Spending Trend
        if (thisWeekExpenses > 0) {
            if (thisWeekExpenses > lastWeekExpenses && lastWeekExpenses > 0) {
                const diff = ((thisWeekExpenses - lastWeekExpenses) / lastWeekExpenses) * 100;
                list.push({
                    icon: <TrendingUp className="w-5 h-5 text-rose-500" />,
                    title: "Spending Increase",
                    text: `You've spent ₹${thisWeekExpenses.toFixed(0)} this week, which is ${diff.toFixed(0)}% more than last week.`,
                    color: "bg-rose-50",
                    textColor: "text-rose-700"
                });
            } else if (thisWeekExpenses < lastWeekExpenses) {
                const diff = ((lastWeekExpenses - thisWeekExpenses) / lastWeekExpenses) * 100;
                list.push({
                    icon: <TrendingDown className="w-5 h-5 text-emerald-500" />,
                    title: "Good Progress!",
                    text: `Your spending is down by ${diff.toFixed(0)}% compared to last week. Keep it up!`,
                    color: "bg-emerald-50",
                    textColor: "text-emerald-700"
                });
            }
        }

        // Insight 2: Debt Collection
        if (peopleOweYou > 1000) {
            list.push({
                icon: <Zap className="w-5 h-5 text-blue-500" />,
                title: "Collect Money",
                text: `You have ₹${peopleOweYou.toFixed(0)} to receive from others. Use the 'Collect' QR codes to settle up faster!`,
                color: "bg-blue-50",
                textColor: "text-blue-700"
            });
        }

        // Insight 3: Category Insight (Placeholder/Simple)
        const categories = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});
        
        const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, null);
        if (topCategory) {
            list.push({
                icon: <Target className="w-5 h-5 text-orange-500" />,
                title: "Top Expense",
                text: `${topCategory} is your biggest expense this month. Consider setting a budget for it.`,
                color: "bg-orange-50",
                textColor: "text-orange-700"
            });
        }

        // Default if nothing else
        if (list.length === 0) {
            list.push({
                icon: <Lightbulb className="w-5 h-5 text-blue-500" />,
                title: "Smart Tip",
                text: "Add your expenses regularly to get personalized financial insights and savings tips.",
                color: "bg-blue-50",
                textColor: "text-blue-700"
            });
        }

        return list;
    }, [transactions, debts]);

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5" />
                </div>
                Smart Insights
            </h2>
            <div className="space-y-4">
                {insights.map((insight, idx) => (
                    <div key={idx} className={`${insight.color} p-4 rounded-2xl flex gap-4 border border-transparent hover:border-white transition-all`}>
                        <div className="mt-1">{insight.icon}</div>
                        <div>
                            <p className="font-bold text-sm text-gray-900">{insight.title}</p>
                            <p className={`text-sm font-medium ${insight.textColor} opacity-90 leading-relaxed`}>
                                {insight.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartInsights;
