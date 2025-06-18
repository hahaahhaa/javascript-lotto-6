import {Console, Random } from "@woowacourse/mission-utils"
import Lotto from "./Lotto"

class App {
  async play() {
    try {
      const amount = await this.getPurchaseAmount();
      const totalCount = amount / 1000;

      const manualCount = await this.getManualCount(totalCount);
      const manualLottos = await this.getManualLottos(manualCount);
      const autoLottos = this.generateAutoLottos(totalCount - manualCount);

      const lottos = [...manualLottos, ...autoLottos];
      this.printLottos(lottos);

      const winningNumbers = await this.getWinningNumbers();
      const bonusNumber = await this.getBonusNumber();

      const result = calculateResult(
        lottos.map(lotto => lotto.getNumbers()),
        winningNumbers,
        bonusNumber
      );

      this.printResult(result, lottos.length);
    } catch (error) {
      Console.print(error.message);
    }
  }

  async getPurchaseAmount() {
    const input = await Console.readLineAsync("구입금액을 입력해 주세요.\n");
    const amount = Number(input);
    if (isNaN(amount) || amount % 1000 !== 0 || amount <= 0) {
      throw new Error("[ERROR] 금액은 1000원 단위의 양수여야 합니다.");
    }
    return amount;
  }

  async getManualCount(maxCount) {
    const input = await Console.readLineAsync("수동으로 구매할 로또 수를 입력해 주세요.\n");
    const count = Number(input);
    if (isNaN(count) || count < 0 || count > maxCount) {
      throw new Error("[ERROR] 수동 로또 개수가 잘못되었습니다.");
    }
    return count;
  }

  async getManualLottos(count) {
    if (count === 0) return [];

    Console.print("수동으로 구매할 번호를 입력해 주세요.");
    const lottos = [];

    for (let i = 0; i < count; i++) {
      const input = await Console.readLineAsync();
      const numbers = input.split(',').map(Number);
      lottos.push(new Lotto(numbers)); // Lotto 생성자에서 유효성 검증
    }

    return lottos;
  }

  generateAutoLottos(count) {
    return Array.from({ length: count }, () => {
      const numbers = Random.pickUniqueNumbersInRange(1, 45, 6);
      return new Lotto(numbers);
    });
  }

  printLottos(lottos) {
    Console.print(`${lottos.length}개를 구매했습니다.`);
    lottos.forEach(lotto => {
      Console.print(`[${lotto.getNumbers().sort((a, b) => a - b).join(", ")}]`);
    });
  }

  async getWinningNumbers() {
    const input = await Console.readLineAsync("당첨 번호를 입력해 주세요.\n");
    return input.split(',').map(Number);
  }

  async getBonusNumber() {
    const input = await Console.readLineAsync("보너스 번호를 입력해 주세요.\n");
    return Number(input);
  }

  printResult(result, ticketCount) {
    Console.print(`당첨 통계\n---`);
    Console.print(`3개 일치 (5,000원) - ${result.match3}개`);
    Console.print(`4개 일치 (50,000원) - ${result.match4}개`);
    Console.print(`5개 일치 (1,500,000원) - ${result.match5}개`);
    Console.print(`5개 일치, 보너스 볼 일치 (30,000,000원) - ${result.match5Bonus}개`);
    Console.print(`6개 일치 (2,000,000,000원) - ${result.match6}개`);

    const totalPrize = result.match3 * 5000 +
                       result.match4 * 50000 +
                       result.match5 * 1500000 +
                       result.match5Bonus * 30000000 +
                       result.match6 * 2000000000;
    const rate = ((totalPrize / (ticketCount * 1000)) * 100).toFixed(1);
    Console.print(`총 수익률은 ${rate}%입니다.`);
  }
}