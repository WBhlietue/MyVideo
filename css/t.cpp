#include<stdio.h>
#include<string.h>
typedef struct{
	int d, m, y;
} Date;

Date read(){
	Date c;
	printf("Year:\n");
	scanf("%d", &c.y);
	printf("Month:\n");
	scanf("%d", &c.m);
	printf("Day:\n");
	scanf("%d", &c.d);
	return c;
}


void print(Date dt){
	if(dt.d<10){
		printf("%02d\n", dt.d);
	}
	else
		printf("%d\n", dt.d);
	if(dt.m<10)
		printf("%02d\n", dt.m);
    else
        printf("%d\n", dt.m);
	printf("%d\n", dt.y);
}

int main(){
    printf("Heden udaa duudah ve:\n");
    int n;
    scanf("%d", &n);
    Date a[n];
    
	for(int i=0; i<n; i++){
	    a[i] = read();
    }
    for(int i=0; i<n; i++){
	    print(a[i]);
    }
    
}