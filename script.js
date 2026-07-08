class Calculator {
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.opearation = undefined;
    this.updateDisplay();
  }

  updateDisplay() {
    this.displayElement.innerText = this.currentOperand;
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;

    if (this.currentOperand === "0" && this.currentOperand !== ".") {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;

    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "0";
  }

  compute() {
    let computation;

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        if (current === 0) {
          this.currentOperand = "Error!";
          this.previousOperand = "";
          this.operation = undefined;
          this.updateDisplay();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = parseFloat(computation.toFixed(10)).toString();

    this.operation = undefined;
    this.previousOperand = "";
    this.updateDisplay();
  }

  delete() {
    if (this.currentOperand === "Error!" || this.currentOperand.length <= 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const displayElement = document.getElementById("display");
  const calculator = new Calculator(displayElement);

  const buttonsContainer = document.querySelector(".buttons");

  buttonsContainer.addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;

    const button = event.target;
    const buttonText = button.innerText;

    if (button.classList.contains("btn-clear")) {
      calculator.clear();
    } else if (button.classList.contains("btn-back")) {
      calculator.delete();
    } else if (button.classList.contains("btn-equal")) {
      calculator.compute();
    } else if (button.classList.contains("btn-op")) {
      if (buttonText === "%") {
        calculator.currentOperand = (
          parseFloat(calculator.currentOperand) / 100
        ).toString();
        calculator.updateDisplay();
      } else {
        calculator.chooseOperation(buttonText);
      }
    } else {
      calculator.appendNumber(buttonText);
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.key >= "0" && event.key <= "9") || event.key === ".") {
      calculator.appendNumber(event.key);
    }

    if (event.key === "Enter" || event.key === "=") {
      calculator.compute();
    }

    if (event.key === "Backspace") {
      calculator.delete();
    }

    if (event.key === "Escape") {
      calculator.clear();
    }

    if (["+", "-", "/", "*"].includes(event.key)) {
      calculator.chooseOperation(event.key);
    }
  });
});
