# You may assume that the CSV file is in the same directory as this script.
import micropip # Don't delete this
await micropip.install('pandas') # Don't delete this
import pandas as pd # Delete this if you found a better way...? I guess...?

class InvalidDataError(Exception):
    pass

def analyze_election_data(filename):
    try:
        df = pd.read_csv(filename)
    except FileNotFoundError:
        raise FileNotFoundError(f"File {filename} not found")
    except Exception:
        raise InvalidDataError("CSV is empty.")
    
    if not all(col in df.columns for col in ['program', 'candidate', 'votes']):
        raise InvalidDataError("CSV must contain 'program', 'candidate', and 'votes' columns")
    
    numeric_votes = pd.to_numeric(df['votes'], errors='coerce')

    if numeric_votes.isnull().any():
        raise InvalidDataError("CSV contains missing or invalid vote entries.")
    
    df['votes'] = numeric_votes.astype(int)

    
    if df.empty:
        return set(), "", {}
    
    total_votes_by_candidate = df.groupby('candidate')['votes'].sum()
    
    candidate_votes_set = set(
        (str(candidate), votes)
        for candidate, votes in total_votes_by_candidate.items()
    )
    
    overall_winner = ""
    if not total_votes_by_candidate.empty:
        overall_winner = str(total_votes_by_candidate.idxmax())

    program_winners = {}
    if 'program' in df.columns:
        for program, group in df.groupby('program'):
            if not group.empty and not group['votes'].empty:
                program_winner_candidate = group.loc[group['votes'].idxmax()]['candidate']
                program_winners[str(program)] = str(program_winner_candidate)

    return [candidate_votes_set, overall_winner, program_winners]