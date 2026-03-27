def finalize(vendor, amount, date):
    """
    Final structured output
    """

    return {
        "vendor": vendor if vendor else "Not found",
        "amount": amount if amount else "Not found",
        "date": date if date else "Not found"
    }