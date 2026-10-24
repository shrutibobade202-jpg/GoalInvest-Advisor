def calculate_monthly_saving(
    target_amount,
    current_savings,
    years,
    annual_return=0
):
    if target_amount < 0:
        raise ValueError("Target amount cannot be negative.")

    if current_savings < 0:
        raise ValueError("Current savings cannot be negative.")

    if years <= 0:
        raise ValueError("Years must be greater than zero.")

    if annual_return < 0:
        raise ValueError("Annual return cannot be negative.")

    months = years * 12

    if annual_return == 0:
        amount_needed = target_amount - current_savings

        if amount_needed <= 0:
            return 0

        return round(amount_needed / months, 2)

    monthly_rate = annual_return / 12 / 100

    current_savings_future_value = (
        current_savings * ((1 + monthly_rate) ** months)
    )

    remaining_target = max(
        target_amount - current_savings_future_value,
        0
    )

    sip_factor = (
        ((1 + monthly_rate) ** months - 1)
        / monthly_rate
    )

    monthly_saving = remaining_target / sip_factor

    return round(monthly_saving, 2)