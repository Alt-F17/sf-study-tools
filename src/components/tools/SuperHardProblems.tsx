import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/mode-python";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { render } from "ace-builds/src-noconflict/ext-static_highlight";

interface TestResult {
  test: string;
  pass: boolean;
  input?: any;
  expected?: any;
  got?: any;
  error?: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  defaultCode: string;
  testScript: (userCode: string) => string;
}

const problems: Problem[] = [
  {
    id: 1,
    title: "Problem 1: Galactic Explorer's Map",
    description: `You are a programmer for a space exploration company. The company wants to map our galaxy with its several planets, each with unique characteristics. You need to design a system to represent the galaxy, planets, and their relationships. Additionally, the exploration team needs a way to navigate through the galaxy using a stack-based pathfinding system.

    <b>Here is a list of tasks you'll need to complete:</b>
    <b>1. Star and Planet Classes:</b>
     - Define a base class   <tt>CelestialBody</tt>   with attributes <tt>name</tt> and <tt>position</tt> (a tuple: (x:int, y:int)).
     - Create subclasses <tt>Star</tt> and <tt>Planet</tt> that inherit from <tt>CelestialBody</tt>. <tt>Star</tt> should have an attribute <tt>temperature</tt>, and <tt>Planet</tt> should have attributes <tt>gravity</tt> and <tt>moons</tt> (a list of moon names).
     - Implement a method <tt>describe()</tt> in each class to return a description of the celestial body: "<tt>NAME</tt> at position <tt>POSITION</tt>" 
     - Use polymorphism to call <tt>describe()</tt> on <tt>Star</tt> instances: "<tt>SUPER.DESCRIBE</tt>, a star with temperature <tt>TEMP</tt>K"
      - Use polymorphism to call <tt>describe()</tt> on <tt>Planet</tt> instances: "<tt>SUPER.DESCRIBE</tt>, a planet with gravity <tt>GRAVITY</tt>m/s^2 and moons: <tt>MOONS</tt>" (or "no moons" if the list is empty).
    <b>2. Galaxy Class:</b>
     - Define a class <tt>Galaxy</tt> (not a subclass) that contains a name and a list of <tt>CelestialBody</tt> objects.
     - Implement a method <tt>find_planet(name)</tt> that searches for a planet by name in the galaxy.
     - Make <tt>Galaxy</tt> iterable so you can loop through its celestial bodies.
    <b>3. Navigation Stack:</b>
     - Implement a <tt>NavigationStack</tt> class with methods: <tt>push(location)</tt>, <tt>pop()</tt>, <tt>top()</tt>, <tt>is_empty()</tt>, and <tt>len()</tt>. <tt>pop()</tt> and <tt>top()</tt> should raise <tt>IndexError</tt> if the stack is empty.
     - Use this stack to simulate a pathfinding journey: start from a star, visit planets, and return to the star.

     <b>4. Testing: Note that the tests are linear here. If a test does not work, it will affect all subsequent tests.</b>`,
    defaultCode: `# Only implement the classes and methods. No main code is needed.
class CelestialBody:
    pass
class Star:
    pass
class Planet:
    pass
class Galaxy:
    pass
class NavigationStack:
    pass`,
testScript: (userCode) => `${userCode}
import json
results = []

try:
    star = Star("Sun", (0, 0), 5500)
    star_test = star.describe()
    results.append({"test":"StarSun","input": "star = Star('Sun', (0, 0), 5500)","expected":"Sun at position (0, 0), a star with temperature 5500K","got":star_test,"pass":star_test=="Sun at position (0, 0), a star with temperature 5500K","error":None})
except Exception as e:
    results.append({"test":"StarSun","input": "star = Star('Sun', (0, 0), 5500)","expected":"Sun at position (0, 0), a star with temperature 5500K","got":str(e),"pass":False,"error":str(e)})

try:
    planet1 = Planet("Earth", (1, 1), 9.8, ["Moon"])
    planet1_test = planet1.describe()
    results.append({"test":"PlanetEarth","input": "planet1 = Planet('Earth', (1, 1), 9.8, ['Moon'])","expected":"Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon","got":planet1_test,"pass":planet1_test=="Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon","error":None})
except Exception as e:
    results.append({"test":"PlanetEarth","input": "planet1 = Planet('Earth', (1, 1), 9.8, ['Moon'])","expected":"Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon","got":str(e),"pass":False,"error":str(e)})

try:
    planet2 = Planet("Mars", (2, 2), 3.7, [])
    planet2_test = planet2.describe()
    results.append({"test":"PlanetMars","input": "planet2 = Planet('Mars', (2, 2), 3.7, [])","expected":"Mars at position (2, 2), a planet with gravity 3.7m/s^2 and moons: no moons","got":planet2_test,"pass":planet2_test=="Mars at position (2, 2), a planet with gravity 3.7m/s^2 and moons: no moons","error":None})
except Exception as e:
    results.append({"test":"PlanetMars","input": "planet2 = Planet('Mars', (2, 2), 3.7, [])","expected":"Mars at position (2, 2), a planet with gravity 3.7m/s^2 and moons: no moons","got":str(e),"pass":False,"error":str(e)})

try:
    planet3 = Planet("Jupiter", (3, 3), 24.8, ["Io", "Europa"])
    planet3_test = planet3.describe()
    results.append({"test":"PlanetJupiter","input": "planet3 = Planet('Jupiter', (3, 3), 24.8, ['Io', 'Europa'])","expected":"Jupiter at position (3, 3), a planet with gravity 24.8m/s^2 and moons: Io, Europa","got":planet3_test,"pass":planet3_test=="Jupiter at position (3, 3), a planet with gravity 24.8m/s^2 and moons: Io, Europa","error":None})
except Exception as e:
    results.append({"test":"PlanetJupiter","input": "planet3 = Planet('Jupiter', (3, 3), 24.8, ['Io', 'Europa'])","expected":"Jupiter at position (3, 3), a planet with gravity 24.8m/s^2 and moons: Io, Europa","got":str(e),"pass":False,"error":str(e)})

try :
    galaxy_test = [body.describe() for body in Galaxy("Milky Way", [star, planet1, planet2, planet3])]
    expected_bodies = ["Sun at position (0, 0), a star with temperature 5500K", "Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon", "Mars at position (2, 2), a planet with gravity 3.7m/s^2 and moons: no moons", "Jupiter at position (3, 3), a planet with gravity 24.8m/s^2 and moons: Io, Europa"]
    results.append({"test":"GalaxyIteration","input": "galaxy_test = [body.describe() for body in Galaxy('Milky Way', [star, planet1, planet2, planet3])]","expected":str(expected_bodies),"got":str(galaxy_test),"pass":galaxy_test==expected_bodies,"error":None})
except Exception as e:
    results.append({"test":"GalaxyIteration","input": "galaxy = Galaxy('Milky Way', [Star('Sun', (0, 0), 5500), Planet('Earth', (1, 1), 9.8, ['Moon']), Planet('Mars', (2, 2), 3.7, [])])","expected":"[list of descriptions]","got":str(e),"pass":False,"error":str(e)})

try:
    galaxy_empty = Galaxy("Empty", [])
    galaxy_empty_test = list(galaxy_empty)
    results.append({"test":"GalaxyEmpty","input": "galaxy_empty = Galaxy('Empty', [])","expected":"[]","got":str(galaxy_empty_test),"pass":galaxy_empty_test==[],"error":None})
except Exception as e:
    results.append({"test":"GalaxyEmpty","input": "galaxy_empty = Galaxy('Empty', [])","expected":"[]","got":str(e),"pass":False,"error":str(e)})

try:
    galaxy = Galaxy("Milky Way", [Star("Sun", (0, 0), 5500), Planet("Earth", (1, 1), 9.8, ["Moon"]), Planet("Mars", (2, 2), 3.7, [])])
    find_test = galaxy.find_planet("Earth")
    find_test_result = find_test.describe() if find_test else None
    results.append({"test":"FindPlanetEarth","input": "galaxy.find_planet('Earth')","expected":"Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon","got":str(find_test_result),"pass":find_test_result=="Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon","error":None})
except Exception as e:
    results.append({"test":"FindPlanetEarth","input": "galaxy.find_planet('Earth')","expected":"Earth at position (1, 1), a planet with gravity 9.8m/s^2 and moons: Moon","got":str(e),"pass":False,"error":str(e)})

try:
    nav = NavigationStack()
    nav.push("Sun")
    nav.push("Earth")
    nav.push("Mars")
    nav_multi_test = {"top": nav.top(), "len": len(nav)}
    results.append({"test":"PushThree","input": "nav.push('Sun'); nav.push('Earth'); nav.push('Mars')","expected":{"top":"Mars", "len":3},"got":nav_multi_test,"pass":nav_multi_test=={"top":"Mars", "len":3},"error":None})
    pops = []
    while not nav.is_empty():
        pops.append(nav.pop())
    results.append({"test":"PopAll","input": "while not nav.is_empty(): pops.append(nav.pop())","expected":["Mars", "Earth", "Sun"],"got":pops,"pass":pops==["Mars", "Earth", "Sun"],"error":None})
except Exception as e:
    results.append({"test":"PushPopAll","input": "nav.push('Sun'); nav.push('Earth'); nav.push('Mars'); pops","expected":"['Mars', 'Earth', 'Sun']","got":str(e),"pass":False,"error":str(e)})

try:
    nav_empty = NavigationStack()
    nav_empty_test = {"is_empty": nav_empty.is_empty(), "len": len(nav_empty)}
    results.append({"test":"EmptyStack","input": "nav = NavigationStack()","expected":{'is_empty':True, 'len':0},"got":nav_empty_test,"pass":nav_empty_test=={'is_empty':True, 'len':0},"error":None})
except Exception as e:
    results.append({"test":"EmptyStack","input": "nav = NavigationStack()","expected":{'is_empty':True, 'len':0},"got":str(e),"pass":False,"error":str(e)})

try:
    nav = NavigationStack()
    nav.top()
    results.append({"test":"TopEmpty","input": "nav.top()","expected":"IndexError","got":"No error","pass":False,"error":None})
except IndexError as e:
    results.append({"test":"TopEmpty","input": "nav.top()","expected":"IndexError","got":"IndexError","pass":True,"error":str(e)})

try:
    nav = NavigationStack()
    nav.pop()
    results.append({"test":"PopEmpty","input": "nav.pop()","expected":"IndexError","got":"No error","pass":False,"error":None})
except IndexError as e:
    results.append({"test":"PopEmpty","input": "nav.pop()","expected":"IndexError","got":"IndexError","pass":True,"error":str(e)})

json.dumps(results)
`,
  },
  {
    id: 2,
    title: "Problem 2: Election Tally",
    description: `You are working for for the DSU and they've just finished their election for <u>VP of Student Services</u>. You have been given a CSV file containing election results from various programs. Your task is to analyze the data, handle errors, and visualize the results.<br />
    Tasks:
    1. Create a function <tt>analyze_election_data</tt> that takes in a CSV file name (eg. '<tt>election_results.csv</tt>') and loads the CSV file using Pandas. The file has columns: <tt>program</tt>, <tt>candidate</tt>, <tt>votes</tt>, eg. <tt>President,Tommy Cassio,10</tt>.
    2. The function should return a list of the total number of votes of the winner, and the winning candidate: 
    [<tt>votes_set</tt>:set of tuples:(<tt>candidate</tt>:str, <tt>votes</tt>:int), <tt>winner</tt>:str, <tt>winner_per_program</tt>:dict].

    3. Handle potential errors:
       - If the file does not exist, raise <tt>FileNotFoundError</tt>.
       - If the file is malformed (e.g., missing columns) or empty, raise a custom exception <tt>InvalidDataError</tt> that YOU must create through inheritance of the <tt>Exception</tt> class.
       - If a candidate is missing votes in any district, raise a <tt>InvalidDataError</tt>.`,
    defaultCode: `# You may assume that the CSV file is in the same directory as this script.
import micropip # Don't delete this
await micropip.install('pandas') # Don't delete this
import pandas as pd # Delete this if you found a better way...? I guess...?

class InvalidDataError:
    pass

def analyze_election_data(file_name):
    pass`,
    testScript: (userCode) => `${userCode}
import json
import pandas as pd
results = []

try:
    votes, winners, program_winners = analyze_election_data('election_results.csv')
    pass_check = [votes, winners, program_winners] == [{('Tommy Cassio', 33), ('Miles Buffit', 21), ('Charlie James', 31)}, 'Tommy Cassio',{'ALC': 'Tommy Cassio', 'Health Sciences': 'Charlie James', 'Pure and Applied': 'Charlie James', 'SCSM': 'Tommy Cassio'}]
    results.append({
        "test": "ValidCSV",
        "input": "analyze_election_data('election_results.csv')",
        "expected": "[{('Tommy Cassio', 33), ('Miles Buffit', 21), ('Charlie James', 31)}, Tommy Cassio, {'ALC': 'Tommy Cassio', 'Health Sciences': 'Charlie James', 'Pure and Applied': 'Charlie James', 'SCSM': 'Tommy Cassio'}]",
        "got": f"[{votes}, {winners}, {program_winners}]",
        "pass": pass_check,
        "error": None
    })
except Exception as e:
    results.append({
        "test": "ValidCSV",
        "input": "analyze_election_data('election_results.csv')",
        "expected": "No exception",
        "got": str(e),
        "pass": False,
        "error": str(e)
    })

try:
    analyze_election_data('nonexistent.csv')
    results.append({
        "test": "NonExistentCSV",
        "input": "analyze_election_data('nonexistent.csv')",
        "expected": "FileNotFoundError",
        "got": "No error",
        "pass": False,
        "error": None
    })
except FileNotFoundError as e:
    results.append({
        "test": "NonExistentCSV",
        "input": "analyze_election_data('nonexistent.csv')",
        "expected": "FileNotFoundError",
        "got": "FileNotFoundError",
        "pass": True,
        "error": str(e)
    })
except Exception as e:
    results.append({
        "test": "NonExistentCSV",
        "input": "analyze_election_data('nonexistent.csv')",
        "expected": "FileNotFoundError",
        "got": str(e),
        "pass": False,
        "error": str(e)
    })

try:
    analyze_election_data('malformed.csv')
    results.append({
        "test": "MissingColumnCSV",
        "input": "analyze_election_data('malformed.csv')",
        "expected": "InvalidDataError",
        "got": "No error",
        "pass": False,
        "error": None
    })
except InvalidDataError as e:
    results.append({
        "test": "MissingColumnCSV",
        "input": "analyze_election_data('malformed.csv')",
        "expected": "InvalidDataError",
        "got": "InvalidDataError",
        "pass": True,
        "error": str(e)
    })
except Exception as e:
    results.append({
        "test": "MissingColumnCSV",
        "input": "analyze_election_data('malformed.csv')",
        "expected": "InvalidDataError",
        "got": str(e),
        "pass": False,
        "error": str(e)
    })

try:
    analyze_election_data('missing_votes.csv')
    results.append({
        "test": "MissingVotesCSV",
        "input": "analyze_election_data('missing_votes.csv')",
        "expected": "InvalidDataError",
        "got": "No error",
        "pass": False,
        "error": None
    })
except InvalidDataError as e:
    results.append({
        "test": "MissingVotesCSV",
        "input": "analyze_election_data('missing_votes.csv')",
        "expected": "InvalidDataError",
        "got": "InvalidDataError",
        "pass": True,
        "error": str(e)
    })
except Exception as e:
    results.append({
        "test": "MissingVotesCSV",
        "input": "analyze_election_data('missing_votes.csv')",
        "expected": "InvalidDataError",
        "got": str(e),
        "pass": False,
        "error": str(e)
    })

try:
    analyze_election_data('empty.csv')
    results.append({
        "test": "EmptyCSV",
        "input": "analyze_election_data('empty.csv')",
        "expected": "InvalidDataError",
        "got": "No error",
        "pass": False,
        "error": None
    })
except InvalidDataError as e:
    results.append({
        "test": "EmptyCSV",
        "input": "analyze_election_data('empty.csv')",
        "expected": "InvalidDataError",
        "got": "InvalidDataError",
        "pass": True,
        "error": str(e)
    })
except Exception as e:
    results.append({
        "test": "EmptyCSV",
        "input": "analyze_election_data('empty.csv')",
        "expected": "InvalidDataError",
        "got": str(e),
        "pass": False,
        "error": str(e)
    })

json.dumps(results)
`,
  },
  {
    id: 3,
    title: "Problem 3: Broken Weather Stations",
    description: `You are a climate scientist analyzing temperature data from a grid of weather stations. The data is represented as a 2D list, where each cell contains a temperature (float) or None (missing data). Your task is to perform various analyses on this grid.

<b>Tasks:</b>
1. Write a function to find the maximum temperature in the grid, ignoring <tt>None</tt> values.
2. Compute the average temperature of the grid, ignoring <tt>None</tt>.
3. Use list comprehension to create a new grid where each temperature is increased by 2°C (leave <tt>None</tt> as <tt>None</tt>).
4. Find all local maxima (cells greater than their four neighbors) and return their positions as tuples (row, col). A cell must be non-<tt>None</tt>, and all its neighbors must also be non-<tt>None</tt> to be considered.
5. Use <tt>filter</tt> to create a list of all temperatures above the average (excluding <tt>None</tt>).
6. Use a set to store all unique temperatures in the grid (excluding <tt>None</tt>).`,
    defaultCode: `def max_temperature(grid):
    pass
def average_temperature(grid):
    pass
def increase_temperature(grid):
    pass
def find_local_maxima(grid):
    pass
def above_average_temperatures(grid):
    pass
def unique_temperatures(grid):
    pass`,
testScript: (userCode) => `${userCode}
import json
results = []

# Define test grids
grid_sample = [
    [None, 20.0, 22.0, 21.0],
    [19.0, 23.0, 24.0, 20.0],
    [18.0, 21.0, 19.0, None]
]
results.append({"test":"grid_sample","input":str(grid_sample),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_all_none = [
    [None, None, None],
    [None, None, None]
]
results.append({"test":"grid_all_none","input":str(grid_all_none),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_empty = []
results.append({"test":"grid_empty","input":str(grid_empty),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_one_element = [[5.0]]
results.append({"test":"grid_one_element","input":str(grid_one_element),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_one_none = [[None]]
results.append({"test":"grid_one_none","input":str(grid_one_none),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_mixed = [
    [None, 10.0],
    [None, 20.0]
]
results.append({"test":"grid_mixed","input":str(grid_mixed),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_local_multi = [
    [1.0, 1.0, 1.0, 1.0],
    [1.0, 5.0, 1.0, 1.0],
    [1.0, 1.0, 6.0, 1.0],
    [1.0, 1.0, 1.0, 1.0]
]
results.append({"test":"grid_local_multi","input":str(grid_local_multi),"expected":"<= Test Grid","got":None,"pass":True,"error":None})
grid_no_maxima = [
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0],
    [7.0, 8.0, 8.0]
]
results.append({"test":"grid_no_maxima","input":str(grid_no_maxima),"expected":"<= Test Grid","got":None,"pass":True,"error":None})

# Test max_temperature
try:
    max_temp_sample = max_temperature(grid_sample)
    results.append({"test":"max_temp_sample","input":"max_temperature(grid_sample)","expected":24.0,"got":max_temp_sample,"pass":max_temp_sample == 24.0,"error":None})
except Exception as e:
    results.append({"test":"max_temp_sample","input":"max_temperature(grid_sample)","expected":24.0,"got":str(e),"pass":False,"error":str(e)})

try:
    max_temp_all_none = max_temperature(grid_all_none)
    results.append({"test":"max_temp_all_none","input":"max_temperature(grid_all_none)","expected":None,"got":max_temp_all_none,"pass":max_temp_all_none is None,"error":None})
except Exception as e:
    results.append({"test":"max_temp_all_none","input":"max_temperature(grid_all_none)","expected":None,"got":str(e),"pass":False,"error":str(e)})

try:
    max_temp_empty = max_temperature(grid_empty)
    results.append({"test":"max_temp_empty","input":"max_temperature(grid_empty)","expected":"ValueError","got":"No error","pass":False,"error":None})
except ValueError as e:
    results.append({"test":"max_temp_empty","input":"max_temperature(grid_empty)","expected":"ValueError","got":"ValueError","pass":True,"error":str(e)})

try:
    max_temp_one_element = max_temperature(grid_one_element)
    results.append({"test":"max_temp_one_element","input":"max_temperature(grid_one_element)","expected":5.0,"got":max_temp_one_element,"pass":max_temp_one_element == 5.0,"error":None})
except Exception as e:
    results.append({"test":"max_temp_one_element","input":"max_temperature(grid_one_element)","expected":5.0,"got":str(e),"pass":False,"error":str(e)})

try:
    max_temp_one_none = max_temperature(grid_one_none)
    results.append({"test":"max_temp_one_none","input":"max_temperature(grid_one_none)","expected":None,"got":max_temp_one_none,"pass":max_temp_one_none is None,"error":None})
except Exception as e:
    results.append({"test":"max_temp_one_none","input":"max_temperature(grid_one_none)","expected":None,"got":str(e),"pass":False,"error":str(e)})

try:
    max_temp_mixed = max_temperature(grid_mixed)
    results.append({"test":"max_temp_mixed","input":"max_temperature(grid_mixed)","expected":20.0,"got":max_temp_mixed,"pass":max_temp_mixed == 20.0,"error":None})
except Exception as e:
    results.append({"test":"max_temp_mixed","input":"max_temperature(grid_mixed)","expected":20.0,"got":str(e),"pass":False,"error":str(e)})

# Test average_temperature
try:
    avg_temp_sample = average_temperature(grid_sample)
    results.append({"test":"avg_temp_sample","input":"average_temperature(grid_sample)","expected":20.7,"got":avg_temp_sample,"pass":abs(avg_temp_sample - 20.7) < 1e-10,"error":None})
except Exception as e:
    results.append({"test":"avg_temp_sample","input":"average_temperature(grid_sample)","expected":20.7,"got":str(e),"pass":False,"error":str(e)})

try:
    avg_temp_all_none = average_temperature(grid_all_none)
    results.append({"test":"avg_temp_all_none","input":"average_temperature(grid_all_none)","expected":None,"got":avg_temp_all_none,"pass":avg_temp_all_none is None,"error":None})
except Exception as e:
    results.append({"test":"avg_temp_all_none","input":"average_temperature(grid_all_none)","expected":None,"got":str(e),"pass":False,"error":str(e)})

try:
    avg_temp_empty = average_temperature(grid_empty)
    results.append({"test":"avg_temp_empty","input":"average_temperature(grid_empty)","expected":"ValueError","got":"No error","pass":False,"error":None})
except ValueError as e:
    results.append({"test":"avg_temp_empty","input":"average_temperature(grid_empty)","expected":"ValueError","got":"ValueError","pass":True,"error":str(e)})

try:
    avg_temp_one_element = average_temperature(grid_one_element)
    results.append({"test":"avg_temp_one_element","input":"average_temperature(grid_one_element)","expected":5.0,"got":avg_temp_one_element,"pass":abs(avg_temp_one_element - 5.0) < 1e-10,"error":None})
except Exception as e:
    results.append({"test":"avg_temp_one_element","input":"average_temperature(grid_one_element)","expected":5.0,"got":str(e),"pass":False,"error":str(e)})

try:
    avg_temp_one_none = average_temperature(grid_one_none)
    results.append({"test":"avg_temp_one_none","input":"average_temperature(grid_one_none)","expected":None,"got":avg_temp_one_none,"pass":avg_temp_one_none is None,"error":None})
except Exception as e:
    results.append({"test":"avg_temp_one_none","input":"average_temperature(grid_one_none)","expected":None,"got":str(e),"pass":False,"error":str(e)})

try:
    avg_temp_mixed = average_temperature(grid_mixed)
    results.append({"test":"avg_temp_mixed","input":"average_temperature(grid_mixed)","expected":15.0,"got":avg_temp_mixed,"pass":abs(avg_temp_mixed - 15.0) < 1e-10,"error":None})
except Exception as e:
    results.append({"test":"avg_temp_mixed","input":"average_temperature(grid_mixed)","expected":15.0,"got":str(e),"pass":False,"error":str(e)})

# Test increase_temperatures
try:
    inc_temp_sample = increase_temperatures(grid_sample, 2)
    expected_inc = [[None, 22.0, 24.0, 23.0], [21.0, 25.0, 26.0, 22.0], [20.0, 23.0, 21.0, None]]
    results.append({"test":"inc_temp_sample","input":"increase_temperatures(grid_sample, 2)","expected":str(expected_inc),"got":str(inc_temp_sample),"pass":inc_temp_sample == expected_inc,"error":None})
except Exception as e:
    results.append({"test":"inc_temp_sample","input":"increase_temperatures(grid_sample, 2)","expected":str(expected_inc),"got":str(e),"pass":False,"error":str(e)})

try:
    inc_temp_all_none = increase_temperatures(grid_all_none, 2)
    expected_inc_none = [[None, None, None], [None, None, None]]
    results.append({"test":"inc_temp_all_none","input":"increase_temperatures(grid_all_none, 2)","expected":str(expected_inc_none),"got":str(inc_temp_all_none),"pass":inc_temp_all_none == expected_inc_none,"error":None})
except Exception as e:
    results.append({"test":"inc_temp_all_none","input":"increase_temperatures(grid_all_none, 2)","expected":str(expected_inc_none),"got":str(e),"pass":False,"error":str(e)})

try:
    inc_temp_one_element = increase_temperatures(grid_one_element, 3)
    expected_inc_one = [[8.0]]
    results.append({"test":"inc_temp_one_element","input":"increase_temperatures(grid_one_element, 3)","expected":str(expected_inc_one),"got":str(inc_temp_one_element),"pass":inc_temp_one_element == expected_inc_one,"error":None})
except Exception as e:
    results.append({"test":"inc_temp_one_element","input":"increase_temperatures(grid_one_element, 3)","expected":str(expected_inc_one),"got":str(e),"pass":False,"error":str(e)})

try:
    inc_temp_one_none = increase_temperatures(grid_one_none, 2)
    expected_inc_none = [[None]]
    results.append({"test":"inc_temp_one_none","input":"increase_temperatures(grid_one_none, 2)","expected":str(expected_inc_none),"got":str(inc_temp_one_none),"pass":inc_temp_one_none == expected_inc_none,"error":None})
except Exception as e:
    results.append({"test":"inc_temp_one_none","input":"increase_temperatures(grid_one_none, 2)","expected":str(expected_inc_none),"got":str(e),"pass":False,"error":str(e)})

try:
    inc_temp_mixed = increase_temperatures(grid_mixed, 5)
    expected_inc_mixed = [[None, 15.0], [None, 25.0]]
    results.append({"test":"inc_temp_mixed","input":"increase_temperatures(grid_mixed, 5)","expected":str(expected_inc_mixed),"got":str(inc_temp_mixed),"pass":inc_temp_mixed == expected_inc_mixed,"error":None})
except Exception as e:
    results.append({"test":"inc_temp_mixed","input":"increase_temperatures(grid_mixed, 5)","expected":str(expected_inc_mixed),"got":str(e),"pass":False,"error":str(e)})

# Test local_maxima
try:
    local_maxima_sample = local_maxima(grid_sample)
    expected_maxima = [(1, 2)]
    results.append({"test":"local_maxima_sample","input":"local_maxima(grid_sample)","expected":str(expected_maxima),"got":str(local_maxima_sample),"pass":local_maxima_sample == expected_maxima,"error":None})
except Exception as e:
    results.append({"test":"local_maxima_sample","input":"local_maxima(grid_sample)","expected":str(expected_maxima),"got":str(e),"pass":False,"error":str(e)})

try:
    local_maxima_multi = local_maxima(grid_local_multi)
    expected_maxima_multi = [(1, 1), (2, 2)]
    results.append({"test":"local_maxima_multi","input":"local_maxima(grid_local_multi)","expected":str(expected_maxima_multi),"got":str(local_maxima_multi),"pass":local_maxima_multi == expected_maxima_multi,"error":None})
except Exception as e:
    results.append({"test":"local_maxima_multi","input":"local_maxima(grid_local_multi)","expected":str(expected_maxima_multi),"got":str(e),"pass":False,"error":str(e)})

try:
    local_maxima_no_maxima = local_maxima(grid_no_maxima)
    expected_no_maxima = []
    results.append({"test":"local_maxima_no_maxima","input":"local_maxima(grid_no_maxima)","expected":str(expected_no_maxima),"got":str(local_maxima_no_maxima),"pass":local_maxima_no_maxima == expected_no_maxima,"error":None})
except Exception as e:
    results.append({"test":"local_maxima_no_maxima","input":"local_maxima(grid_no_maxima)","expected":str(expected_no_maxima),"got":str(e),"pass":False,"error":str(e)})

try:
    local_maxima_all_none = local_maxima(grid_all_none)
    expected_none_maxima = []
    results.append({"test":"local_maxima_all_none","input":"local_maxima(grid_all_none)","expected":str(expected_none_maxima),"got":str(local_maxima_all_none),"pass":local_maxima_all_none == expected_none_maxima,"error":None})
except Exception as e:
    results.append({"test":"local_maxima_all_none","input":"local_maxima(grid_all_none)","expected":str(expected_none_maxima),"got":str(e),"pass":False,"error":str(e)})

# Test above_average
try:
    above_avg_sample = above_average(grid_sample)
    expected_above = [22.0, 21.0, 23.0, 24.0, 21.0]
    results.append({"test":"above_avg_sample","input":"above_average(grid_sample)","expected":str(expected_above),"got":str(above_avg_sample),"pass":above_avg_sample == expected_above,"error":None})
except Exception as e:
    results.append({"test":"above_avg_sample","input":"above_average(grid_sample)","expected":str(expected_above),"got":str(e),"pass":False,"error":str(e)})

try:
    above_avg_all_none = above_average(grid_all_none)
    expected_above_none = []
    results.append({"test":"above_avg_all_none","input":"above_average(grid_all_none)","expected":str(expected_above_none),"got":str(above_avg_all_none),"pass":above_avg_all_none == expected_above_none,"error":None})
except Exception as e:
    results.append({"test":"above_avg_all_none","input":"above_average(grid_all_none)","expected":str(expected_above_none),"got":str(e),"pass":False,"error":str(e)})

try:
    above_avg_one_element = above_average(grid_one_element)
    expected_above_one = []
    results.append({"test":"above_avg_one_element","input":"above_average(grid_one_element)","expected":str(expected_above_one),"got":str(above_avg_one_element),"pass":above_avg_one_element == expected_above_one,"error":None})
except Exception as e:
    results.append({"test":"above_avg_one_element","input":"above_average(grid_one_element)","expected":str(expected_above_one),"got":str(e),"pass":False,"error":str(e)})

try:
    above_avg_mixed = above_average(grid_mixed)
    expected_above_mixed = [20.0]
    results.append({"test":"above_avg_mixed","input":"above_average(grid_mixed)","expected":str(expected_above_mixed),"got":str(above_avg_mixed),"pass":above_avg_mixed == expected_above_mixed,"error":None})
except Exception as e:
    results.append({"test":"above_avg_mixed","input":"above_average(grid_mixed)","expected":str(expected_above_mixed),"got":str(e),"pass":False,"error":str(e)})

# Test unique_temperatures
try:
    unique_temps_sample = unique_temperatures(grid_sample)
    expected_unique = {18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0}
    results.append({"test":"unique_temps_sample","input":"unique_temperatures(grid_sample)","expected":str(expected_unique),"got":str(unique_temps_sample),"pass":unique_temps_sample == expected_unique,"error":None})
except Exception as e:
    results.append({"test":"unique_temps_sample","input":"unique_temperatures(grid_sample)","expected":str(expected_unique),"got":str(e),"pass":False,"error":str(e)})

try:
    unique_temps_all_none = unique_temperatures(grid_all_none)
    expected_unique_none = set()
    results.append({"test":"unique_temps_all_none","input":"unique_temperatures(grid_all_none)","expected":str(expected_unique_none),"got":str(unique_temps_all_none),"pass":unique_temps_all_none == expected_unique_none,"error":None})
except Exception as e:
    results.append({"test":"unique_temps_all_none","input":"unique_temperatures(grid_all_none)","expected":str(expected_unique_none),"got":str(e),"pass":False,"error":str(e)})

try:
    unique_temps_one_element = unique_temperatures(grid_one_element)
    expected_unique_one = {5.0}
    results.append({"test":"unique_temps_one_element","input":"unique_temperatures(grid_one_element)","expected":str(expected_unique_one),"got":str(unique_temps_one_element),"pass":unique_temps_one_element == expected_unique_one,"error":None})
except Exception as e:
    results.append({"test":"unique_temps_one_element","input":"unique_temperatures(grid_one_element)","expected":str(expected_unique_one),"got":str(e),"pass":False,"error":str(e)})

try:
    unique_temps_one_none = unique_temperatures(grid_one_none)
    expected_unique_none = set()
    results.append({"test":"unique_temps_one_none","input":"unique_temperatures(grid_one_none)","expected":str(expected_unique_none),"got":str(unique_temps_one_none),"pass":unique_temps_one_none == expected_unique_none,"error":None})
except Exception as e:
    results.append({"test":"unique_temps_one_none","input":"unique_temperatures(grid_one_none)","expected":str(expected_unique_none),"got":str(e),"pass":False,"error":str(e)})

try:
    unique_temps_mixed = unique_temperatures(grid_mixed)
    expected_unique_mixed = {10.0, 20.0}
    results.append({"test":"unique_temps_mixed","input":"unique_temperatures(grid_mixed)","expected":str(expected_unique_mixed),"got":str(unique_temps_mixed),"pass":unique_temps_mixed == expected_unique_mixed,"error":None})
except Exception as e:
    results.append({"test":"unique_temps_mixed","input":"unique_temperatures(grid_mixed)","expected":str(expected_unique_mixed),"got":str(e),"pass":False,"error":str(e)})

try:
    unique_temps_local_multi = unique_temperatures(grid_empty)
    expected_empty = set()
    results.append({"test":"unique_temps_local_multi","input":"unique_temperatures(grid_empty)","expected":str(expected_empty),"got":str(unique_temps_local_multi),"pass":unique_temps_local_multi == expected_empty,"error":None})
except Exception as e:
    results.append({"test":"unique_temps_local_multi","input":"unique_temperatures(grid_empty)","expected":str(expected_empty),"got":str(e),"pass":False,"error":str(e)})

json.dumps(results)
`,
  },
  {
    id: 4,
    title: "Problem 4: Python Is Just a Fancy Calculator",
    description: `You are building a calculator for a math tutoring app. The app needs to evaluate mathematical expressions with nested parentheses, such as "(2 + (3 * 4))". You must design a system to parse and evaluate these expressions.
<b>Tasks</b>:
<b>1. Expression Classes:</b>
  - Define a base class <tt>Expression</tt> with a method <tt>evaluate()</tt> that returns itself.
  - Create a subclass <tt>Number</tt> that holds a float value and implements <tt>evaluate()</tt> to return the value.
  - Create a subclass <tt>BinaryOperation</tt> that holds a left and right <tt>Expression</tt> and an operator (e.g., +, -, *, /). You need to implement <tt>evaluate()</tt> to perform the operation on the left and right expressions. Division by zero should raise a <tt>ZeroDivisionError</tt>.
<b>2. Expression Parser:</b>
    - Implement a function <tt>parse_expression(expr: str) -> Expression</tt> that takes a string expression and returns an <tt>Expression</tt> object. You may assume the expression is well-formed, bounded by parentheses. (e.g., "(2 + 3)" or "(4 * (5 - 2))").
    - The parser should handle nested parentheses recursively and operator precedence (e.g., multiplication before addition).
`,
    defaultCode: `class Expression:
    pass
class Number:
    pass
class BinaryOperation:
    pass
def parse_expression(expr: str) -> Expression:
    pass`,
testScript: (userCode) => `${userCode}
import json
results = []
try:
    expr = parse_expression("(5)")
    result = expr.evaluate()
    results.append({"test":"SimpleNumber","input": "parse_expression('(5)')","expected":5.0,"got":result, "pass":result==5.0, "error":None})
except Exception as e:
    results.append({"test":"SimpleNumber","input": "parse_expression('(5)')","expected":5.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(2 + 3)")
    result = expr.evaluate()
    results.append({"test":"BinaryAdd","input": "parse_expression('(2 + 3)')","expected":5.0,"got":result, "pass":result==5.0, "error":None})
except Exception as e:
    results.append({"test":"BinaryAdd","input": "parse_expression('(2 + 3)')","expected":5.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(5 - 3)")
    result = expr.evaluate()
    results.append({"test":"BinarySub","input": "parse_expression('(5 - 3)')","expected":2.0,"got":result, "pass":result==2.0, "error":None})
except Exception as e:
    results.append({"test":"BinarySub","input": "parse_expression('(5 - 3)')","expected":2.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(4 * 3)")
    result = expr.evaluate()
    results.append({"test":"BinaryMul","input": "parse_expression('(4 * 3)')","expected":12.0,"got":result, "pass":result==12.0, "error":None})
except Exception as e:
    results.append({"test":"BinaryMul","input": "parse_expression('(4 * 3)')","expected":12.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(10 / 2)")
    result = expr.evaluate()
    results.append({"test":"BinaryDiv","input": "parse_expression('(10 / 2)')","expected":5.0,"got":result, "pass":result==5.0, "error":None})
except Exception as e:
    results.append({"test":"BinaryDiv","input": "parse_expression('(10 / 2)')","expected":5.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("((2 + 3) * 4)")
    result = expr.evaluate()
    results.append({"test":"NestedExpression1","input": "parse_expression('((2 + 3) * 4)')","expected":20.0,"got":result, "pass":result==20.0, "error":None})
except Exception as e:
    results.append({"test":"NestedExpression1","input": "parse_expression('((2 + 3) * 4)')","expected":20.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(2 + 3 * 4)")
    result = expr.evaluate()
    results.append({"test":"PrecedenceExpression","input": "parse_expression('(2 + 3 * 4)')","expected":14.0,"got":result, "pass":result==14.0, "error":None})
except Exception as e:
    results.append({"test":"PrecedenceExpression","input": "parse_expression('(2 + 3 * 4)')","expected":14.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("((10 - (4 / 2)) + (5 * (6 / 3)))")
    result = expr.evaluate()
    results.append({"test":"ComplexNested","input": "parse_expression('((10 - (4 / 2)) + (5 * (6 / 3)))')","expected":18.0,"got":result, "pass":result==18.0, "error":None})
except Exception as e:
    results.append({"test":"ComplexNested","input": "parse_expression('((10 - (4 / 2)) + (5 * (6 / 3)))')","expected":18.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(-3 + 4)")
    result = expr.evaluate()
    results.append({"test":"NegativeNumber","input": "parse_expression('(-3 + 4)')","expected":1.0,"got":result, "pass":result==1.0, "error":None})
except Exception as e:
    results.append({"test":"NegativeNumber","input": "parse_expression('(-3 + 4)')","expected":1.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(2.5 + 3.5)")
    result = expr.evaluate()
    results.append({"test":"FloatNumbers","input": "parse_expression('(2.5 + 3.5)')","expected":6.0,"got":result, "pass":result==6.0, "error":None})
except Exception as e:
    results.append({"test":"FloatNumbers","input": "parse_expression('(2.5 + 3.5)')","expected":6.0,"got":str(e), "pass":False, "error":str(e)})
try:
    expr = parse_expression("(10 / 0)")
    expr.evaluate()
    results.append({"test":"DivisionByZero","input": "parse_expression('(10 / 0)')","expected":"ValueError","got":"No error","pass":False, "error":None})
except ValueError as e:
    results.append({"test":"DivisionByZero","input": "parse_expression('(10 / 0)')","expected":"ValueError","got":"ValueError","pass":True, "error":str(e)})
try:
    parse_expression("(2 + )")
    results.append({"test":"InvalidExpression","input": "parse_expression('(2 + )')","expected":"ValueError","got":"No error","pass":False, "error":None})
except ValueError as e:
    results.append({"test":"InvalidExpression","input": "parse_expression('(2 + )')","expected":"ValueError","got":"ValueError","pass":True, "error":str(e)})
try:
    parse_expression("(2 # 3)")
    results.append({"test":"InvalidOperator","input": "parse_expression('(2 # 3)')","expected":"ValueError","got":"No error","pass":False, "error":None})
except ValueError as e:
    results.append({"test":"InvalidOperator","input": "parse_expression('(2 # 3)')","expected":"ValueError","got":"ValueError","pass":True, "error":str(e)})
try:
    expr = parse_expression("( 2 + 3 )")
    result = expr.evaluate()
    results.append({"test":"WithSpaces","input": "parse_expression('( 2 + 3 )')","expected":5.0,"got":result, "pass":result==5.0, "error":None})
except Exception as e:
    results.append({"test":"WithSpaces","input": "parse_expression('( 2 + 3 )')","expected":5.0,"got":str(e), "pass":False, "error":str(e)})
try:
    num = Number(5)
    result = num.evaluate()
    results.append({"test":"NumberEvaluate","input": "Number(5).evaluate()","expected":5.0,"got":result, "pass":result==5.0, "error":None})
except Exception as e:
    results.append({"test":"NumberEvaluate","input": "Number(5).evaluate()","expected":5.0,"got":str(e), "pass":False, "error":str(e)})
try:
    bin_op = BinaryOperation(Number(2), '+', Number(3))
    result = bin_op.evaluate()
    results.append({"test":"BinaryOperationEvaluate","input": "BinaryOperation(Number(2), '+', Number(3)).evaluate()","expected":5.0,"got":result, "pass":result==5.0, "error":None})
except Exception as e:
    results.append({"test":"BinaryOperationEvaluate","input": "BinaryOperation(Number(2), '+', Number(3)).evaluate()","expected":5.0,"got":str(e), "pass":False, "error":str(e)})
try:
    bin_op_div_zero = BinaryOperation(Number(10), '/', Number(0))
    bin_op_div_zero.evaluate()
    results.append({"test":"BinaryOperationDivZero","input": "BinaryOperation(Number(10), '/', Number(0)).evaluate()","expected":"ValueError","got":"No error","pass":False, "error":None})
except ValueError as e:
    results.append({"test":"BinaryOperationDivZero","input": "BinaryOperation(Number(10), '/', Number(0)).evaluate()","expected":"ValueError","got":"ValueError","pass":True, "error":str(e)})
json.dumps(results)
`,
  }
];

const SuperHardProblems: React.FC = () => {
  // Persist user-written code for each problem, initialize from localStorage if present
  const [codes, setCodes] = useState<Record<number, string>>(() => {
    try {
      const stored = localStorage.getItem('superHardProblemsCodes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore parse errors
    }
    return problems.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultCode }), {});
  });

  // Whenever codes change, write them back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('superHardProblemsCodes', JSON.stringify(codes));
    } catch {
      // storage might be unavailable
    }
  }, [codes]);

  const [pyodide, setPyodide] = useState<any>(null);
  const editors = useRef<Record<number, any>>({});
  const [results, setResults] = useState<Record<number, TestResult[]>>({});

  useEffect(() => {
    const initPy = async () => {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.onload = async () => {
          const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
          setPyodide(py);
          await py.loadPackage(['micropip', 'numpy']);
        };
        document.body.appendChild(script);
      } else {
        const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        setPyodide(py);
        await py.loadPackage(['micropip', 'numpy']);
      }
    };
    initPy();
  }, []);

  // Helper to parse raw JSON results into TestResult array
  const parseResults = (raw: string): TestResult[] => {
    try {
      const parsed = JSON.parse(raw);
      const cases = Array.isArray(parsed) ? parsed : parsed.cases || [];
      return cases.map((tc: any) => ({
        test: tc.test || tc.description || 'test',
        pass: !!tc.pass,
        input: tc.input,
        expected: tc.expected,
        got: tc.got ?? tc.actual,
        error: tc.error
      }));
    } catch (e: any) {
      return [{ test: 'parse_error', pass: false, error: e.message || String(e) }];
    }
  };

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return 'N/A';
    else if (typeof val === 'object') {
      return JSON.stringify(val);
    } else {
      return String(val);
    }
  };

  const runTest = async (prob: Problem) => {
    if (!pyodide) return;
    const userCode = codes[prob.id];
    setResults(s => ({ ...s, [prob.id]: [] }));
    let raw = '';
    try {
        let response1 = await fetch('/election_results.csv');
        let text1 = await response1.text();
        let response2 = await fetch('/empty.csv');
        let text2 = await response2.text();
        let response3 = await fetch('/malformed.csv');
        let text3 = await response3.text();
        let response4 = await fetch('/missing_votes.csv');
        let text4 = await response4.text();

        pyodide.FS.writeFile('election_results.csv', text1);
        pyodide.FS.writeFile('empty.csv', text2);
        pyodide.FS.writeFile('malformed.csv', text3);
        pyodide.FS.writeFile('missing_votes.csv', text4);
      const script = prob.testScript(userCode);
      const result = await pyodide.runPythonAsync(script);
      // Handle cases where Python returns undefined or null
      raw = result != null ? result.toString() : '';
    } catch (e: any) {
      const full = e.stack || e.message || String(e);
      const start = full.indexOf('File "<exec>"');
      const end = full.indexOf('at new_error', start);
      const snippet = start >= 0 && end > start ? full.slice(start, end) : full;
      const errLine = snippet.trim();
      setResults(s => ({
        ...s,
        [prob.id]: [{ test: 'execution_error', pass: false, error: errLine }]
      }));
      return;
    }
    const resultsArr = parseResults(raw);
    setResults(s => ({ ...s, [prob.id]: resultsArr }));
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Final Boss Problems (Tests won't work without actually trying to solve :/ )</CardTitle>
      </CardHeader>
      <CardContent>
        {problems.map(p => (
          <div key={p.id} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
            <p
              className="mb-4 text-gray-900"
              dangerouslySetInnerHTML={{ __html: p.description.replace(/\n/g, '<br />') }}
            />
            <AceEditor
              mode="python"
              theme="github_light_default"
              name={`boss-${p.id}`}
              onLoad={ed => (editors.current[p.id] = ed)}
              value={codes[p.id]}
              onChange={val => setCodes(s => ({ ...s, [p.id]: val }))}
              fontSize={14}
              width="100%"
              setOptions={{ useWorker: false, maxLines: Infinity }}
            />
            {/* Run / Reset Buttons */}
            <div className="flex space-x-2 mt-2">
              <Button onClick={() => runTest(p)}>Run Tests</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCodes(s => ({ ...s, [p.id]: p.defaultCode }));
                }}
              >
                Reset Editor
              </Button>
            </div>
            {/* Results Table */}
            {results[p.id] && (
              <div className="mt-4 w-full overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-sm font-semibold">Test</th>
                      <th className="border border-gray-300 p-2 text-sm font-semibold">Input</th>
                      <th className="border border-gray-300 p-2 text-sm font-semibold">Expected</th>
                      <th className="border border-gray-300 p-2 text-sm font-semibold">Output</th>
                      <th className="border border-gray-300 p-2 text-sm font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[p.id].map((r, i) => (
                      <tr key={i} className={r.pass ? 'bg-green-50' : 'bg-red-50'}>
                        <td className="border border-gray-300 p-2 text-sm">{r.test}</td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {renderValue(r.input)}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {renderValue(r.expected)}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm">
                          {renderValue(r.error ?? r.got)}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm text-center font-semibold">
                          {r.pass ? '✅' : '❌'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SuperHardProblems;