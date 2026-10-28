from .seed_data_part1 import SEED_FOODS as PART1
from .seed_data_part2 import SEED_FOODS_PART2 as PART2
from .seed_data_part3 import SEED_FOODS_PART3 as PART3

SEED_FOODS = PART1 + PART2 + PART3

assert len(SEED_FOODS) == 100, f"Expected exactly 100 food items, got {len(SEED_FOODS)}"

