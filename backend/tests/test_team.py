def test_team_filter():

    tasks = [
        {"task":"Frontend", "team_id":1},
        {"task":"Backend", "team_id":2}
    ]

    user_team = 1

    result = [
        t for t in tasks
        if t["team_id"] == user_team
    ]

    assert len(result) == 1