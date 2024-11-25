const amount = 1234567;
const formattedAmount = new Intl.NumberFormat("vi-VI", {
	style: "currency",
	currency: "VND",
}).format(amount);

console.log(formattedAmount);
