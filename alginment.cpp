#include <bits/stdc++.h>

using namespace std;
int gap_cost = -5;
bool inPair(char x, char y)
{
    if (x > y)
        swap(x, y);
    if ((x == 'A' && y == 'C') || (x == 'G' && y == 'T'))
        return true;
    return false;
}
int main()
{
    freopen("input.inp", "r", stdin);
    freopen("output.out", "w", stdout);
    string ADNx, ADNy;
    cin >> ADNx >> ADNy;
    int x = ADNx.size();
    int y = ADNy.size();
    ADNx = " " + ADNx;
    ADNy = " " + ADNy;
    int dp[x + 5][y + 5];
    int editCost[x + 5][y + 5];
    for (int i = 1; i <= x; i++)
        for (int j = 1; j <= y; j++)
        {
            if (ADNx[i] == ADNy[j])
            {
                switch (ADNx[i])
                {
                case 'A':
                    editCost[i][j] = 1;
                    break;

                case 'C':
                    editCost[i][j] = 2;
                    break;

                case 'G':
                    editCost[i][j] = 3;
                    break;

                case 'T':
                    editCost[i][j] = 4;
                    break;

                default:
                    break;
                }
            }
            else
            {
                if (inPair(ADNx[i], ADNy[j]))
                    editCost[i][j] = -1;
                else
                    editCost[i][j] = -2;
            }
        }
    dp[0][0] = 0;
    for (int i = 1; i <= x; i++)
        dp[i][0] = dp[i - 1][0] + gap_cost;
    for (int j = 1; j <= y; j++)
        dp[0][j] = dp[0][j - 1] + gap_cost;

    for (int i = 1; i <= x; i++)
        for (int j = 1; j <= y; j++)
        {
            dp[i][j] = max((max(dp[i - 1][j], dp[i][j - 1]) + gap_cost), dp[i - 1][j - 1] + editCost[i][j]);
        }
    cout << x << " " << y << endl;
    for (int i = 1; i <= x; i++)
    {
        for (int j = 1; j <= y; j++)
            cout << dp[i][j] << " ";
        cout << endl;
    }
    cout << dp[x][y] << "\n";
    
    cout << "Alignment: \n";
    string alignX = "", alignY = "";
    while (x != 0 || y != 0)
    {
        if (dp[x][y] == dp[x - 1][y - 1] + editCost[x][y])
        {
            alignX = ADNx[x] + alignX;
            alignY = ADNy[y] + alignY;
            x--;
            y--;
        }
        else
        {
            if (dp[x][y] == dp[x - 1][y] + gap_cost)
            {
                alignX = ADNx[x] + alignX;
                alignY = '_' + alignY;
                x--;
            }
            else if (dp[x][y] == dp[x][y - 1] + gap_cost)
            {
                alignX = '_' + alignX;
                alignY = ADNy[y] + alignY;
                y--;
            }
        }
    }
    cout << alignX << endl;
    cout << alignY;
    return 0;
}