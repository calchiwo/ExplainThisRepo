def print_stack(report: dict, owner: str, repo: str) -> None:
    print(f"\nStack summary for {owner}/{repo}\n")

    for key, title in [
        ("languages", "Languages"),
        ("runtimes", "Runtime"),
        ("frameworks", "Frameworks"),
        ("databases", "Databases"),
        ("tooling", "Tooling"),
        ("infra", "Infrastructure / Deploy"),
        ("package_managers", "Package Managers"),
    ]:
        values = report.get(key)
        if not values:
            continue
        print(f"{title}:")
        for v in values:
            print(f"- {v}")
        print()
