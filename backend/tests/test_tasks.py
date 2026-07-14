def test_task_status():

    task = {
        "task": "Create UI",
        "status": "Pending"
    }

    assert task["status"] == "Pending"