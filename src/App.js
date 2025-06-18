import {Console, Random } from "@woowacourse/mission-utils"
import Lotto from "./Lotto"

class App {
  async play() {
    try {
      const amountInput = await Console.readLineAsync()
      const amount = Number(amountInput)
      if (isNaN(amount) || amount % 1000 !== 0 || amount <= 0) {
        throw new Error("[ERROR] 금액은 1000원 단위의 양수여야 합니다.");
      }
  
      const numbers = amount / 1000;
      Console.print(`${numbers}개를 구매했습니다.`);
  
      const lottos = [];
      for (let i = 0; i < numbers; i++) {
        const lottoNumbers = Random.pickUniqueNumbersInRange(1, 45, 6);
        const lotto = new Lotto(lottoNumbers);
        lottos.push(lotto);
        Console.print(`[${lotto.getNumbers().join(", ")}]`);
      }
  
      const winningNumbers = await Console.readLineAsync();
      const bonusNumber = await Console.readLineAsync();
  
      const result = calculateResult(lottos.map(l => l.getNumbers()), winningNumbers, bonusNumber);
  
      Console.print(`3개 일치 (5,000원) - ${result.match3}개`);
      Console.print(`4개 일치 (50,000원) - ${result.match4}개`);
      Console.print(`5개 일치 (1,500,000원) - ${result.match5}개`);
      Console.print(`5개 일치, 보너스 볼 일치 (30,000,000원) - ${result.match5Bonus}개`);
      Console.print(`6개 일치 (2,000,000,000원) - ${result.match6}개`);
  
      const totalPrice =
        result.match3 * 5000 +
        result.match4 * 50000 +
        result.match5 * 1500000 +
        result.match5Bonus * 30000000 +
        result.match6 * 2000000000;
      const rate = ((totalPrice / (lottos.length * 1000)) * 100).toFixed(1);
      Console.print(`총 수익률은 ${rate}%입니다.`);
    } catch (error) {
      Console.print(error.message);
    }
  }
}

const calculateResult = (lottos, winningNumbers, bonusNumber) => {
  const parsedWinningNumbers = winningNumbers.split(',').map(Number)
  const parsedbonusNumber = Number(bonusNumber)

  const result = {
    match3: 0,
    match4: 0,
    match5: 0,
    match5Bonus: 0,
    match6: 0,
  }

  for (let i = 0; i < lottos.length; i++) {
    const lottoNumbers = lottos[i]
    const matchCount = parsedWinningNumbers.filter(number => lottoNumbers.includes(number)).length
    if (matchCount === 6) {
      result.match6++;
    } else if (matchCount === 5 && lottoNumbers.includes(parsedbonusNumber)) {
      result.match5Bonus++;
    } else if (matchCount === 5) {
      result.match5++;
    } else if (matchCount === 4) {
      result.match4++;
    } else if (matchCount === 3) {
      result.match3++;
    }
  }
  return result;
}

export default App;
